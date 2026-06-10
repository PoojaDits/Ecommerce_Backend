import { Router } from "express";
import {createStoreHandler,updateStoreHandler,deleteStoreHandler,getAllStoresHandler,getStoreByIdHandler} from "../controller/storeController";
import authenticateUser from "../middleware/auth.Middleware";
import authorizeRoles from "../middleware/roleGuard";

const router = Router();

/**
 * @swagger
 * /api/stores:
 *   get:
 *     summary: Get all stores (public)
 *     tags:
 *       - Stores
 *     responses:
 *       200:
 *         description: List of all stores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Stores retrieved successfully.
 *                 stores:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Store'
 *       500:
 *         description: Failed to retrieve stores
 */
router.get("/", getAllStoresHandler);

/**
 * @swagger
 * /api/stores/{id}:
 *   get:
 *     summary: Get a store by ID (public)
 *     tags:
 *       - Stores
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Store ID
 *     responses:
 *       200:
 *         description: Store retrieved successfully
 *       400:
 *         description: Valid store ID is required
 *       404:
 *         description: Store not found
 */
router.get("/:id", getStoreByIdHandler);

/**
 * @swagger
 * /api/stores:
 *   post:
 *     summary: Create a new store (authenticated vendors/admins)
 *     tags:
 *       - Stores
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - storeName
 *               - storeLocation
 *               - storeEmail
 *             properties:
 *               storeName:
 *                 type: string
 *                 example: My Electronics Store
 *               storeDescription:
 *                 type: string
 *                 example: Best electronics shop in town
 *               storeLocation:
 *                 type: string
 *                 example: 42 Market Street, Mumbai
 *               storeContact:
 *                 type: string
 *                 example: "+919876543210"
 *               storeEmail:
 *                 type: string
 *                 example: mystore@example.com
 *     responses:
 *       201:
 *         description: Store created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", authenticateUser, authorizeRoles("admin", "vendor"), createStoreHandler);

/**
 * @swagger
 * /api/stores/{id}:
 *   put:
 *     summary: Update a store by ID (authenticated vendors/admins)
 *     tags:
 *       - Stores
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Store ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               storeName:
 *                 type: string
 *               storeDescription:
 *                 type: string
 *               storeLocation:
 *                 type: string
 *               storeContact:
 *                 type: string
 *               storeEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Store updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Store not found
 */
router.put("/:id", authenticateUser, authorizeRoles("admin", "vendor"), updateStoreHandler);

/**
 * @swagger
 * /api/stores/{id}:
 *   delete:
 *     summary: Delete a store by ID (admin only)
 *     tags:
 *       - Stores
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Store ID
 *     responses:
 *       200:
 *         description: Store deleted successfully
 *       400:
 *         description: Valid store ID is required
 *       404:
 *         description: Store not found
 */
router.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteStoreHandler);

export default router;
