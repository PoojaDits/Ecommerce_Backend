import { Router } from "express";
import {
  createAddressHandler,
  updateAddressHandler,
  getAllAddressesHandler,
  getAddressByIdHandler,
  deleteAddressHandler,
} from "../controller/addressController";
import authenticateUser from "../middleware/auth.Middleware";
import authorizeRoles from "../middleware/roleGuard";

const router = Router();

/**
 * All address routes require authentication because addresses are
 * user-bound resources. Admin can see all addresses; regular users
 * will eventually be scoped to their own addresses via controller logic.
 */
router.use(authenticateUser);

/**
 * @swagger
 * tags:
 *   - name: Addresses
 *     description: Address management (authenticated)
 */

/**
 * @swagger
 * /api/addresses:
 *   post:
 *     summary: Create a new address
 *     tags: [Addresses]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [street, city, state, postalCode, country]
 *             properties:
 *               street: { type: string, example: 42 Market Street }
 *               city: { type: string, example: Mumbai }
 *               state: { type: string, example: Maharashtra }
 *               postalCode: { type: string, example: "400001" }
 *               country: { type: string, example: India }
 *               type: { type: string, enum: [home, work, other], example: home }
 *               isDefault: { type: boolean, example: false }
 *     responses:
 *       201:
 *         description: Address created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */
router.post("/", createAddressHandler);

/**
 * @swagger
 * /api/addresses:
 *   get:
 *     summary: Get all addresses (admin only)
 *     tags: [Addresses]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Addresses retrieved successfully
 */
router.get("/", authorizeRoles("admin"), getAllAddressesHandler);

/**
 * @swagger
 * /api/addresses/{id}:
 *   get:
 *     summary: Get an address by ID
 *     tags: [Addresses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address retrieved successfully
 *       404:
 *         description: Address not found
 */
router.get("/:id", getAddressByIdHandler);

/**
 * @swagger
 * /api/addresses/{id}:
 *   put:
 *     summary: Update an address by ID
 *     tags: [Addresses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street: { type: string, example: 99 New Road }
 *               city: { type: string, example: Delhi }
 *               state: { type: string, example: Delhi }
 *               postalCode: { type: string, example: "110001" }
 *               country: { type: string, example: India }
 *               type: { type: string, enum: [home, work, other] }
 *               isDefault: { type: boolean }
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Address not found
 */
router.put("/:id", updateAddressHandler);

/**
 * @swagger
 * /api/addresses/{id}:
 *   delete:
 *     summary: Delete an address by ID
 *     tags: [Addresses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       404:
 *         description: Address not found
 */
router.delete("/:id", deleteAddressHandler);

export default router;