import { Router } from "express";
import authenticateUser from "../middleware/auth.Middleware";
import authorizeRoles from "../middleware/roleGuard";
import {
  checkoutHandler,
  getMyOrdersHandler,
  getOrderByIdHandler,
  cancelOrderHandler,
  cancelOrderItemHandler,
  createShipmentHandler,
  requestReturnHandler,
} from "../controller/orderController";

const router = Router();
router.use(authenticateUser);

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Order checkout & retrieval (no payment; lifecycle status is tracked via ShipmentTracking)
 */

/**
 * @swagger
 * /api/orders/checkout:
 *   post:
 *     summary: Checkout the current cart and create an order
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckoutRequest'
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Validation error / empty cart / insufficient stock
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Address does not belong to the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User or address not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/checkout", checkoutHandler);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders of the authenticated user
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdersListResponse'
 */
router.get("/", getMyOrdersHandler);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get a single order by ID (must belong to the user)
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       403:
 *         description: Order does not belong to the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", getOrderByIdHandler);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Cancel the entire order
 *     description: >
 *       Soft-cancels every still-active item of the order (sets `is_active = false`),
 *       restores their quantities back to product stock, and resets `totalAmount` to 0.
 *       Not allowed once any shipment has been created for the order.
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       403:
 *         description: Order does not belong to the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Already cancelled, or already shipped
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:id/cancel", cancelOrderHandler);

/**
 * @swagger
 * /api/orders/{id}/items/{itemId}/cancel:
 *   patch:
 *     summary: Cancel a single item from the order
 *     description: >
 *       Soft-cancels one order item (sets is_active = false), restores its quantity
 *       back to product stock, and recomputes the order's totalAmount from the
 *       remaining active items. Not allowed once any shipment has been created.
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order item ID
 *     responses:
 *       200:
 *         description: Order item cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       403:
 *         description: Order does not belong to the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Order or item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Item already cancelled, or order already shipped
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:id/items/:itemId/cancel", cancelOrderItemHandler);

/**
 * @swagger
 * /api/orders/{id}/shipment:
 *   post:
 *     summary: Create a shipment for an order (admin/vendor)
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [carrier, trackingNumber]
 *             properties:
 *               carrier: { type: string, example: FedEx }
 *               trackingNumber: { type: string, example: FX123456789 }
 *     responses:
 *       201:
 *         description: Shipment created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Order not found
 */
router.post("/:id/shipment", authenticateUser, authorizeRoles("admin", "vendor"), createShipmentHandler);

/**
 * @swagger
 * /api/orders/{id}/items/{itemId}/return:
 *   post:
 *     summary: Request a return for a specific order item (customer)
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order item ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *                 example: "Item arrived damaged"
 *     responses:
 *       201:
 *         description: Return requested successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Order does not belong to user
 *       404:
 *         description: Order or item not found
 */
router.post("/:id/items/:itemId/return", requestReturnHandler);

export default router;
