import { AppDataSource } from "../config/dataSource";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { Address } from "../entities/Address";
import { User } from "../entities/User";
import Product from "../entities/Product";
import { Shipment } from "../entities/Shipment";
import { ShipmentTracking } from "../entities/ShipmentTracking";
import { ReturnStatus } from "../entities/ReturnStatus";
import { MESSAGES } from "../constants/messages";
import {
  ReturnState,
  OrderLifecycle,
} from "../enums";
import {
  ORDER_LIFECYCLE_STAGES,
  isCancellationAllowed,
} from "../utils/orderLifecycle";

/**
 * Place an order from the user's current cart.
 * - Validates the user has a non-empty cart.
 * - Validates that the chosen address belongs to the user.
 * - Re-checks stock for each cart item and decrements product stock.
 * - Snapshots productName + price into OrderItem rows.
 * - Creates the Order.
 * - Clears the cart.
 *
 * NOTE: Order lifecycle status is tracked separately via ShipmentTracking,
 * so the Order entity itself does not carry a status column.
 *
 * All operations run in a single DB transaction.
 */
export const checkout = async (
  userId: number,
  addressId: number
): Promise<Order> => {
  return await AppDataSource.transaction(async (manager) => {
    const userRepo = manager.getRepository(User);
    const cartRepo = manager.getRepository(Cart);
    const cartItemRepo = manager.getRepository(CartItem);
    const addressRepo = manager.getRepository(Address);
    const productRepo = manager.getRepository(Product);
    const orderRepo = manager.getRepository(Order);
    const orderItemRepo = manager.getRepository(OrderItem);

    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error(MESSAGES.USER.NOT_FOUND);
    }

    const address = await addressRepo.findOne({
      where: { id: addressId },
      relations: ["user"],
    });
    if (!address) {
      throw new Error(MESSAGES.ADDRESS.NOT_FOUND);
    }
    if (!address.user || address.user.id !== userId) {
      throw new Error(MESSAGES.ORDER.ADDRESS_NOT_OWNED);
    }

    const cart = await cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ["items", "items.product"],
    });
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new Error(MESSAGES.ORDER.EMPTY_CART);
    }

    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    for (const item of cart.items) {
      const product = item.product
        ? await productRepo.findOne({ where: { id: item.product.id } })
        : null;

      if (!product || !product.isActive) {
        throw new Error(
          MESSAGES.ORDER.PRODUCT_UNAVAILABLE(
            item.product?.name || "Unknown product"
          )
        );
      }

      if (item.quantity > product.stock) {
        throw new Error(MESSAGES.ORDER.INSUFFICIENT_STOCK(product.name));
      }

      product.stock = product.stock - item.quantity;
      await productRepo.save(product);

      const price = Number(product.price);
      totalAmount += price * item.quantity;

      const orderItem = new OrderItem();
      orderItem.product = product;
      orderItem.productName = product.name;
      orderItem.price = price;
      orderItem.quantity = item.quantity;
      orderItems.push(orderItem);
    }

    const order = new Order();
    order.user = user;
    order.address = address;
    order.cart = cart;
    order.totalAmount = Number(totalAmount.toFixed(2));
    order.orderItems = orderItems;

    const savedOrder = await orderRepo.save(order);

    for (const oi of orderItems) {
      oi.order = savedOrder;
    }
    await orderItemRepo.save(orderItems);

    await cartItemRepo.remove(cart.items);

    const finalOrder = await orderRepo.findOne({
      where: { id: savedOrder.id },
      relations: ["orderItems", "orderItems.product", "address", "user"],
    });
    return finalOrder!;
  });
};

export const getMyOrders = async (userId: number): Promise<Order[]> => {
  const orderRepo = AppDataSource.getRepository(Order);
  return await orderRepo.find({
    where: { user: { id: userId } },
    relations: ["orderItems", "orderItems.product", "address"],
    order: { id: "DESC" },
  });
};

export const getOrderById = async (
  userId: number,
  orderId: number
): Promise<Order> => {
  const orderRepo = AppDataSource.getRepository(Order);
  const order = await orderRepo.findOne({
    where: { id: orderId },
    relations: [
      "orderItems",
      "orderItems.product",
      "address",
      "user",
      "shipments",
      "shipments.shipment_trackings",
    ],
  });
  if (!order) {
    throw new Error(MESSAGES.ORDER.NOT_FOUND);
  }
  if (!order.user || order.user.id !== userId) {
    throw new Error(MESSAGES.ORDER.NOT_OWNED);
  }
  return order;
};

// ──────────────────────────────────────────────
//  Order lifecycle helpers
// ──────────────────────────────────────────────

/**
 * Derive the overall OrderLifecycle from an order's shipment tracking data.
 *
 * - No shipments                        → PENDING
 * - All shipments still in pre-dispatch  → PACKED  (label_created / packed)
 * - Any shipment has been dispatched     → the most advanced stage found
 */
export const deriveOrderLifecycle = (order: Order): OrderLifecycle => {
  if (!order.shipments || order.shipments.length === 0) {
    return OrderLifecycle.PENDING;
  }

  let highestStageIndex = 0; // PENDING

  for (const shipment of order.shipments) {
    const trackings = shipment.shipment_trackings;
    if (!trackings || trackings.length === 0) continue;

    // The last tracking entry is the current status of this shipment
    const latest = trackings.reduce((a, b) =>
      new Date(a.updated_at) > new Date(b.updated_at) ? a : b
    );

    const stageIndex = ORDER_LIFECYCLE_STAGES.indexOf(
      latest.status as OrderLifecycle
    );
    if (stageIndex > highestStageIndex) {
      highestStageIndex = stageIndex;
    }
  }

  return ORDER_LIFECYCLE_STAGES[highestStageIndex] || OrderLifecycle.PENDING;
};

/**
 * Cancel an entire order.
 * - Marks every active OrderItem as inactive.
 * - Restores product stock for each cancelled item.
 * - Sets totalAmount to 0.
 * - Allowed only if the order lifecycle is before SHIPPED.
 */
export const cancelOrder = async (
  userId: number,
  orderId: number
): Promise<Order> => {
  return await AppDataSource.transaction(async (manager) => {
    const orderRepo = manager.getRepository(Order);
    const orderItemRepo = manager.getRepository(OrderItem);
    const productRepo = manager.getRepository(Product);

    const order = await orderRepo.findOne({
      where: { id: orderId },
      relations: [
        "orderItems",
        "orderItems.product",
        "user",
        "shipments",
        "shipments.shipment_trackings",
      ],
    });

    if (!order) throw new Error(MESSAGES.ORDER.NOT_FOUND);
    if (!order.user || order.user.id !== userId)
      throw new Error(MESSAGES.ORDER.NOT_OWNED);

    // Derive the lifecycle and check if cancellation is allowed
    const lifecycle = deriveOrderLifecycle(order);
    if (!isCancellationAllowed(lifecycle)) {
      // Give a meaningful message based on current stage
      if (lifecycle === OrderLifecycle.SHIPPED || lifecycle === OrderLifecycle.OUT_FOR_DELIVERY) {
        throw new Error(MESSAGES.ORDER.CANNOT_CANCEL_SHIPPED);
      }
      if (lifecycle === OrderLifecycle.DELIVERED) {
        throw new Error(MESSAGES.ORDER.CANNOT_CANCEL_DELIVERED);
      }
      throw new Error(MESSAGES.ORDER.CANNOT_CANCEL_SHIPPED);
    }

    // If every item is already inactive, order is already cancelled
    const allInactive = order.orderItems.every((item) => !item.is_active);
    if (allInactive) throw new Error(MESSAGES.ORDER.ALREADY_CANCELLED);

    for (const item of order.orderItems) {
      if (item.is_active) {
        item.is_active = false;
        // Restore product stock
        if (item.product) {
          const product = await productRepo.findOne({
            where: { id: item.product.id },
          });
          if (product) {
            product.stock = product.stock + item.quantity;
            await productRepo.save(product);
          }
        }
        await orderItemRepo.save(item);
      }
    }

    order.totalAmount = 0;
    await orderRepo.save(order);

    const finalOrder = await orderRepo.findOne({
      where: { id: order.id },
      relations: ["orderItems", "orderItems.product", "address", "user"],
    });
    return finalOrder!;
  });
};

/**
 * Cancel a single item within an order.
 * - Marks that item as inactive, restores its stock.
 * - Recalculates the order total from remaining active items.
 * - Allowed only if the order lifecycle is before SHIPPED.
 */
export const cancelOrderItem = async (
  userId: number,
  orderId: number,
  itemId: number
): Promise<Order> => {
  return await AppDataSource.transaction(async (manager) => {
    const orderRepo = manager.getRepository(Order);
    const orderItemRepo = manager.getRepository(OrderItem);
    const productRepo = manager.getRepository(Product);

    const order = await orderRepo.findOne({
      where: { id: orderId },
      relations: [
        "orderItems",
        "orderItems.product",
        "user",
        "shipments",
        "shipments.shipment_trackings",
      ],
    });

    if (!order) throw new Error(MESSAGES.ORDER.NOT_FOUND);
    if (!order.user || order.user.id !== userId)
      throw new Error(MESSAGES.ORDER.NOT_OWNED);

    // Derive the lifecycle and check if cancellation is allowed
    const lifecycle = deriveOrderLifecycle(order);
    if (!isCancellationAllowed(lifecycle)) {
      if (lifecycle === OrderLifecycle.SHIPPED || lifecycle === OrderLifecycle.OUT_FOR_DELIVERY) {
        throw new Error(MESSAGES.ORDER.CANNOT_CANCEL_SHIPPED);
      }
      if (lifecycle === OrderLifecycle.DELIVERED) {
        throw new Error(MESSAGES.ORDER.CANNOT_CANCEL_DELIVERED);
      }
      throw new Error(MESSAGES.ORDER.CANNOT_CANCEL_SHIPPED);
    }

    const targetItem = order.orderItems.find((oi) => oi.id === itemId);
    if (!targetItem) throw new Error(MESSAGES.ORDER.ITEM_NOT_FOUND);
    if (!targetItem.is_active)
      throw new Error(MESSAGES.ORDER.ITEM_ALREADY_CANCELLED);

    // Cancel the item and restore stock
    targetItem.is_active = false;
    if (targetItem.product) {
      const product = await productRepo.findOne({
        where: { id: targetItem.product.id },
      });
      if (product) {
        product.stock = product.stock + targetItem.quantity;
        await productRepo.save(product);
      }
    }
    await orderItemRepo.save(targetItem);

    // Recalculate total from remaining active items
    const newTotal = order.orderItems
      .filter((oi) => oi.is_active)
      .reduce((sum, oi) => sum + Number(oi.price) * oi.quantity, 0);
    order.totalAmount = Number(newTotal.toFixed(2));
    await orderRepo.save(order);

    const finalOrder = await orderRepo.findOne({
      where: { id: order.id },
      relations: ["orderItems", "orderItems.product", "address", "user"],
    });
    return finalOrder!;
  });
};

// ──────────────────────────────────────────────
//  Shipment & Return helpers (full-flow extras)
// ──────────────────────────────────────────────

/**
 * Create a shipment for an order (admin/vendor operation).
 */
export const createShipment = async (
  orderId: number,
  carrier: string,
  trackingNumber: string
): Promise<Shipment> => {
  return await AppDataSource.transaction(async (manager) => {
    const orderRepo = manager.getRepository(Order);
    const shipmentRepo = manager.getRepository(Shipment);
    const trackingRepo = manager.getRepository(ShipmentTracking);

    const order = await orderRepo.findOne({
      where: { id: orderId },
      relations: ["shipments"],
    });
    if (!order) throw new Error(MESSAGES.ORDER.NOT_FOUND);

    const shipment = new Shipment();
    shipment.carrier = carrier;
    shipment.trackingNumber = trackingNumber;
    shipment.order = order;
    const saved = await shipmentRepo.save(shipment);

    // Create initial tracking entry
    const tracking = new ShipmentTracking();
    tracking.status = OrderLifecycle.PACKED;
    tracking.location = "Shipper facility";
    tracking.shipment = saved;
    await trackingRepo.save(tracking);

    return saved;
  });
};

/**
 * Initiate a return request for an order item.
 */
export const requestReturn = async (
  userId: number,
  orderId: number,
  itemId: number,
  note?: string
): Promise<ReturnStatus> => {
  return await AppDataSource.transaction(async (manager) => {
    const orderRepo = manager.getRepository(Order);
    const orderItemRepo = manager.getRepository(OrderItem);
    const returnStatusRepo = manager.getRepository(ReturnStatus);

    const order = await orderRepo.findOne({
      where: { id: orderId },
      relations: ["user"],
    });
    if (!order) throw new Error(MESSAGES.ORDER.NOT_FOUND);
    if (!order.user || order.user.id !== userId)
      throw new Error(MESSAGES.ORDER.NOT_OWNED);

    const item = await orderItemRepo.findOne({
      where: { id: itemId, order: { id: orderId } },
    });
    if (!item) throw new Error(MESSAGES.ORDER.ITEM_NOT_FOUND);
    if (!item.is_active)
      throw new Error("Cannot return a cancelled item.");

    if (item.returnStatus) {
      throw new Error("A return has already been requested for this item.");
    }

    const returnStatus = new ReturnStatus();
    returnStatus.status = ReturnState.REQUESTED;
    returnStatus.note = note || "";

    const saved = await returnStatusRepo.save(returnStatus);

    item.returnStatus = saved;
    await orderItemRepo.save(item);

    return saved;
  });
};