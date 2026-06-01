// ============================================================
//  Cart Routes  (beginner friendly version)
//  This file connects the URLs to the controller functions.
// ============================================================

import { Router } from "express";
import authenticateUser from "../middleware/auth.Middleware";
import {
  getCartHandler,
  addCartItemHandler,
  updateCartItemHandler,
  removeCartItemHandler,
  clearCartHandler,
} from "../controller/cartController";

const router = Router();

// Every cart route needs the user to be logged in.
router.use(authenticateUser);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get my cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 */
router.get("/", getCartHandler);

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     summary: Add a product to my cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Item added to cart
 */
router.post("/items", addCartItemHandler);

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   put:
 *     summary: Update the quantity of a cart item
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated
 */
router.put("/items/:itemId", updateCartItemHandler);

/**
 * @swagger
 * /api/cart/items/{itemId}:
 *   delete:
 *     summary: Remove one item from the cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item removed from cart
 */
router.delete("/items/:itemId", removeCartItemHandler);

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Clear all items from the cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.delete("/", clearCartHandler);

export default router;
