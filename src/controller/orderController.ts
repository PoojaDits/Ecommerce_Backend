import { isCancellationAllowed } from "../utils/orderLifecycle";
import { Response } from "express";
import { AuthRequest } from "../interfaces/authInterface";
import {checkout,getMyOrders,getOrderById,cancelOrder,cancelOrderItem,createShipment,requestReturn,deriveOrderLifecycle,} from "../services/orderService";
import { checkoutSchema } from "../validators/orderValidator";
import { MESSAGES } from "../constants/messages";

const serializeOrder = (order: any) => {
  const lifecycle = deriveOrderLifecycle(order);
  const canCancel = isCancellationAllowed(lifecycle);

  return {
    id: order.id,
    totalAmount: Number(order.totalAmount),
    lifecycle,
    canCancel,
    created_at: order.created_at,
    updated_at: order.updated_at,
    address: order.address
      ? {
          id: order.address.id,
          street: order.address.street,
          city: order.address.city,
          state: order.address.state,
          postalCode: order.address.postalCode,
          country: order.address.country,
        }
      : null,
    orderItems: (order.orderItems || []).map((it: any) => ({
      id: it.id,
      productId: it.product ? it.product.id : null,
      productName: it.productName,
      quantity: it.quantity,
      price: Number(it.price),
      subtotal: Number(it.price) * it.quantity,
      is_active: it.is_active !== false,
    })),
  };
};

export const checkoutHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const { error, value } = checkoutSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        message: error.details?.[0]?.message || MESSAGES.VALIDATION.FAILED,
      });
      return;
    }

    const order = await checkout(userId, value.addressId);

    res.status(201).json({
      success: true,
      message: MESSAGES.ORDER.CHECKOUT_SUCCESS,
      order: serializeOrder(order),
    });
  } catch (error: any) {
    const message = error?.message || MESSAGES.ORDER.CHECKOUT_FAILED;
    let statusCode = 400;
    if (
      message === MESSAGES.USER.NOT_FOUND ||
      message === MESSAGES.ADDRESS.NOT_FOUND
    ) {
      statusCode = 404;
    } else if (message === MESSAGES.ORDER.ADDRESS_NOT_OWNED) {
      statusCode = 403;
    }
    res.status(statusCode).json({ success: false, message });
  }
};

export const getMyOrdersHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const orders = await getMyOrders(userId);
    res.status(200).json({
      success: true,
      message: MESSAGES.ORDER.GET_SUCCESS,
      orders: orders.map(serializeOrder),
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error?.message || MESSAGES.ORDER.GET_FAILED,
    });
  }
};

export const getOrderByIdHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      res.status(400).json({
        success: false,
        message: MESSAGES.ORDER.ID_REQUIRED,
      });
      return;
    }

    const order = await getOrderById(userId, orderId);
    res.status(200).json({
      success: true,
      message: MESSAGES.ORDER.GET_ONE_SUCCESS,
      order: serializeOrder(order),
    });
  } catch (error: any) {
    const message = error?.message || MESSAGES.ORDER.GET_ONE_FAILED;
    let statusCode = 400;
    if (message === MESSAGES.ORDER.NOT_FOUND) statusCode = 404;
    else if (message === MESSAGES.ORDER.NOT_OWNED) statusCode = 403;
    res.status(statusCode).json({ success: false, message });
  }
};

export const cancelOrderHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      res.status(400).json({
        success: false,
        message: MESSAGES.ORDER.ID_REQUIRED,
      });
      return;
    }

    const order = await cancelOrder(userId, orderId);
    res.status(200).json({
      success: true,
      message: MESSAGES.ORDER.CANCEL_SUCCESS,
      order: serializeOrder(order),
    });
  } catch (error: any) {
    const message = error?.message || MESSAGES.ORDER.CANCEL_FAILED;
    let statusCode = 400;
    if (message === MESSAGES.ORDER.NOT_FOUND) statusCode = 404;
    else if (message === MESSAGES.ORDER.NOT_OWNED) statusCode = 403;
    else if (message === MESSAGES.ORDER.CANNOT_CANCEL_SHIPPED) statusCode = 409;
    else if (message === MESSAGES.ORDER.CANNOT_CANCEL_DELIVERED) statusCode = 409;
    else if (message === MESSAGES.ORDER.ALREADY_CANCELLED) statusCode = 409;
    res.status(statusCode).json({ success: false, message });
  }
};

export const createShipmentHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const orderId = Number(req.params.id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      res.status(400).json({
        success: false,
        message: MESSAGES.ORDER.ID_REQUIRED,
      });
      return;
    }

    const { carrier, trackingNumber } = req.body;
    if (!carrier || !trackingNumber) {
      res.status(400).json({
        success: false,
        message: "carrier and trackingNumber are required.",
      });
      return;
    }

    const shipment = await createShipment(orderId, carrier, trackingNumber);
    res.status(201).json({
      success: true,
      message: "Shipment created successfully.",
      shipment,
    });
  } catch (error: any) {
    const message = error?.message || "Failed to create shipment.";
    const statusCode = message === MESSAGES.ORDER.NOT_FOUND ? 404 : 400;
    res.status(statusCode).json({ success: false, message });
  }
};

export const requestReturnHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const orderId = Number(req.params.id);
    const itemId = Number(req.params.itemId);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      res.status(400).json({
        success: false,
        message: MESSAGES.ORDER.ID_REQUIRED,
      });
      return;
    }
    if (!Number.isInteger(itemId) || itemId <= 0) {
      res.status(400).json({
        success: false,
        message: MESSAGES.ORDER.ITEM_ID_REQUIRED,
      });
      return;
    }

    const note = req.body.note as string | undefined;
    const returnStatus = await requestReturn(userId, orderId, itemId, note);
    res.status(201).json({
      success: true,
      message: "Return requested successfully.",
      returnStatus,
    });
  } catch (error: any) {
    const message = error?.message || "Failed to request return.";
    let statusCode = 400;
    if (message === MESSAGES.ORDER.NOT_FOUND || message === MESSAGES.ORDER.ITEM_NOT_FOUND) {
      statusCode = 404;
    } else if (message === MESSAGES.ORDER.NOT_OWNED) {
      statusCode = 403;
    }
    res.status(statusCode).json({ success: false, message });
  }
};

export const cancelOrderItemHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const orderId = Number(req.params.id);
    const itemId = Number(req.params.itemId);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      res.status(400).json({
        success: false,
        message: MESSAGES.ORDER.ID_REQUIRED,
      });
      return;
    }
    if (!Number.isInteger(itemId) || itemId <= 0) {
      res.status(400).json({
        success: false,
        message: MESSAGES.ORDER.ITEM_ID_REQUIRED,
      });
      return;
    }

    const order = await cancelOrderItem(userId, orderId, itemId);
    res.status(200).json({
      success: true,
      message: MESSAGES.ORDER.ITEM_CANCEL_SUCCESS,
      order: serializeOrder(order),
    });
  } catch (error: any) {
    const message = error?.message || MESSAGES.ORDER.ITEM_CANCEL_FAILED;
    let statusCode = 400;
    if (
      message === MESSAGES.ORDER.NOT_FOUND ||
      message === MESSAGES.ORDER.ITEM_NOT_FOUND
    ) {
      statusCode = 404;
    } else if (message === MESSAGES.ORDER.NOT_OWNED) {
      statusCode = 403;
    } else if (
      message === MESSAGES.ORDER.CANNOT_CANCEL_SHIPPED ||
      message === MESSAGES.ORDER.CANNOT_CANCEL_DELIVERED ||
      message === MESSAGES.ORDER.ITEM_ALREADY_CANCELLED
    ) {
      statusCode = 409;
    }
    res.status(statusCode).json({ success: false, message });
  }
};
