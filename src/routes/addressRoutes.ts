import { Router } from "express";
import {createAddressHandler} from "../controller/addressController";

const router = Router();

/**
 * @swagger
 * /api/addresses:
 *   post:
 *     summary: Create a new address
 *     tags:
 *       - Addresses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - street
 *               - city
 *               - state
 *               - postalCode
 *               - country
 *               - userId
 *             properties:
 *               street:
 *                 type: string
 *                 example: 42 Market Street
 *               city:
 *                 type: string
 *                 example: Mumbai
 *               state:
 *                 type: string
 *                 example: Maharashtra
 *               postalCode:
 *                 type: string
 *                 example: "400001"
 *               country:
 *                 type: string
 *                 example: India
 *               userId:
 *                 type: integer
 *                 example: 1
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