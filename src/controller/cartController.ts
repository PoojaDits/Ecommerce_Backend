
import { Response } from "express";
import { AuthRequest } from "../interfaces/authInterface";
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../services/cartService";


export const getCartHandler = async (req: AuthRequest, res: Response) => {
  try {

    const userId = req.user!.id;

    const cart = await getCart(userId);

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully.",
      cart: cart,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
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
        message: "productId and quantity are required.",
      });
      return;
    }

    if (quantity < 1) {
      res.status(400).json({
        success: false,
        message: "Quantity must be at least 1.",
      });
      return;
    }

    const cart = await addItemToCart(userId, productId, quantity);

    res.status(201).json({
      success: true,
      message: "Item added to cart.",
      cart: cart,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const updateCartItemHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

   
    const itemId = Number(req.params.itemId);
    const quantity = req.body.quantity;

    if (!quantity || quantity < 1) {
      res.status(400).json({
        success: false,
        message: "Quantity must be at least 1.",
      });
      return;
    }

    const cart = await updateCartItem(userId, itemId, quantity);

    res.status(200).json({
      success: true,
      message: "Cart item updated.",
      cart: cart,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};



export const removeCartItemHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const itemId = Number(req.params.itemId);

    const cart = await removeCartItem(userId, itemId);

    res.status(200).json({
      success: true,
      message: "Item removed from cart.",
      cart: cart,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const clearCartHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const cart = await clearCart(userId);

    res.status(200).json({
      success: true,
      message: "Cart cleared.",
      cart: cart,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
