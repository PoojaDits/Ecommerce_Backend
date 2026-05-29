import { Router } from "express";
import {
  createStoreHandler,
  updateStoreHandler,
  deleteStoreHandler,
  getAllStoresHandler,
  getStoreByIdHandler,
  getStoresByUserHandler,
} from "../controller/storeController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Stores
 *   description: Store management APIs
 */

/**
 * @swagger
 * /api/stores:
 *   get:
 *     summary: Get all stores
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
 * /api/stores:
 *   post:
 *     summary: Create a new store
 *     tags:
 *       - Stores
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
 *               - userId
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
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Store created successfully
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
 *                   example: Store created successfully.
 *                 store:
 *                   $ref: '#/components/schemas/Store'
 *       400:
 *         description: Validation error, user not found, or store already exists
 */
router.post("/", createStoreHandler);

/**
 * @swagger
 * /api/stores/{id}:
 *   put:
 *     summary: Update a store by ID
 *     tags:
 *       - Stores
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
 *                 example: Updated Store Name
 *               storeDescription:
 *                 type: string
 *                 example: Updated description
 *               storeLocation:
 *                 type: string
 *                 example: 99 New Road, Delhi
 *               storeContact:
 *                 type: string
 *                 example: "+911234567890"
 *               storeEmail:
 *                 type: string
 *                 example: updated@example.com
 *     responses:
 *       200:
 *         description: Store updated successfully
 *       400:
 *         description: Validation error or store already exists with same name/email
 *       404:
 *         description: Store not found
 */
router.put("/:id", updateStoreHandler);
/**
 * @swagger
 * /api/stores/user/{userId}:
 *   get:
 *     summary: Get all stores belonging to a user
 *     tags:
 *       - Stores
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of stores for the user
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
 *       400:
 *         description: Valid user ID is required
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to retrieve stores
 */
router.get("/user/:userId", getStoresByUserHandler);

/**
 * @swagger
 * /api/stores/{id}:
 *   get:
 *     summary: Get a store by ID
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
 *                 store:
 *                   $ref: '#/components/schemas/Store'
 *       400:
 *         description: Valid store ID is required
 *       404:
 *         description: Store not found
 */
router.get("/:id", getStoreByIdHandler);

/**
 * @swagger
 * /api/stores/{id}:
 *   delete:
 *     summary: Delete a store by ID
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
 *         description: Store deleted successfully
 *       400:
 *         description: Valid store ID is required
 *       404:
 *         description: Store not found
 */
router.delete("/:id", deleteStoreHandler);

export default router;
