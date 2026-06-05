import { Router } from "express";
import {
  createAddressHandler,
  updateAddressHandler,
  getAllAddressesHandler,
  getAddressByIdHandler,
  deleteAddressHandler,
} from "../controller/addressController";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Addresses
 *     description: Address management
 */

/**
 * @swagger
 * /api/addresses:
 *   post:
 *     summary: Create a new address
 *     tags: [Addresses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [street, city, state, postalCode, country, userId]
 *             properties:
 *               street: { type: string, example: 42 Market Street }
 *               city: { type: string, example: Mumbai }
 *               state: { type: string, example: Maharashtra }
 *               postalCode: { type: string, example: "400001" }
 *               country: { type: string, example: India }
 *               userId: { type: integer, example: 1 }
 *     responses:
 *       201:
 *         description: Address created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddressResponse'
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
 *     summary: Get all addresses
 *     tags: [Addresses]
 *     responses:
 *       200:
 *         description: Addresses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddressesListResponse'
 */
router.get("/", getAllAddressesHandler);

/**
 * @swagger
 * /api/addresses/{id}:
 *   get:
 *     summary: Get an address by ID
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddressResponse'
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
 *     responses:
 *       200:
 *         description: Address updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddressResponse'
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Address not found
 */
router.delete("/:id", deleteAddressHandler);

export default router;
