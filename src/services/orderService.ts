import { AppDataSource } from "../config/dataSource";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { Address } from "../entities/Address";
import { User } from "../entities/User";
import Product from "../entities/Product";
import { MESSAGES } from "../constants/messages";

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
    relations: ["orderItems", "orderItems.product", "address", "user"],
  });
  if (!order) {
    throw new Error(MESSAGES.ORDER.NOT_FOUND);
  }
  if (!order.user || order.user.id !== userId) {
    throw new Error(MESSAGES.ORDER.NOT_OWNED);
  }
  return order;
};
