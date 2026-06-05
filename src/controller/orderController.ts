import { Response } from "express";
import { AuthRequest } from "../interfaces/authInterface";
import {checkout,getMyOrders,getOrderById,} from "../services/orderService";
import { checkoutSchema } from "../validators/orderValidator";
import { MESSAGES } from "../constants/messages";

const serializeOrder = (order: any) => {
  return {
    id: order.id,
    totalAmount: Number(order.totalAmount),
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
