import { Response } from "express";
import { AuthRequest } from "../interfaces/authInterface";
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../services/cartService";
import { MESSAGES } from "../constants/messages";

export const getCartHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const cart = await getCart(userId);
    res.status(200).json({
      success: true,
      message: MESSAGES.CART.GET_SUCCESS,
      cart: cart,
    });
  } catch (error: any) {
    res
      .status(400)
      .json({
        success: false,
        message: error.message || MESSAGES.CART.GET_FAILED,
      });
  }
};

export const addCartItemHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const productId = req.body.productId;
    const quantity = req.body.quantity;

    if (!productId || !quantity) {
      res.status(400).json({
        success: false,
        message: MESSAGES.CART.ITEM_ADD_FAILED,
      });
      return;
    }

    if (quantity < 1) {
      res.status(400).json({
        success: false,
        message: MESSAGES.CART.INSUFFICIENT_STOCK,
      });
      return;
    }

    const cart = await addItemToCart(userId, productId, quantity);
    res.status(201).json({
      success: true,
      message: MESSAGES.CART.ITEM_ADDED,
      cart: cart,
    });
  } catch (error: any) {
    res
      .status(400)
      .json({
        success: false,
        message: error.message || MESSAGES.CART.ITEM_ADD_FAILED,
      });
  }
};

export const updateCartItemHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const itemId = Number(req.params.itemId);
    const quantity = req.body.quantity;

    if (!quantity || quantity < 1) {
      res.status(400).json({
        success: false,
        message: MESSAGES.CART.INSUFFICIENT_STOCK,
      });
      return;
    }

    const cart = await updateCartItem(userId, itemId, quantity);
    res.status(200).json({
      success: true,
      message: MESSAGES.CART.ITEM_UPDATED,
      cart: cart,
    });
  } catch (error: any) {
    res
      .status(400)
      .json({
        success: false,
        message: error.message || MESSAGES.CART.ITEM_UPDATE_FAILED,
      });
  }
};

export const removeCartItemHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;
    const itemId = Number(req.params.itemId);
    const cart = await removeCartItem(userId, itemId);
    res.status(200).json({
      success: true,
      message: MESSAGES.CART.ITEM_REMOVED,
      cart: cart,
    });
  } catch (error: any) {
    res
      .status(400)
      .json({
        success: false,
        message: error.message || MESSAGES.CART.ITEM_REMOVE_FAILED,
      });
  }
};

export const clearCartHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const cart = await clearCart(userId);
    res.status(200).json({
      success: true,
      message: MESSAGES.CART.CLEAR_SUCCESS,
      cart: cart,
    });
  } catch (error: any) {
    res
      .status(400)
      .json({
        success: false,
        message: error.message || MESSAGES.CART.CLEAR_FAILED,
      });
  }
};
