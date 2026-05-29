import { Router } from "express";
import {
  createCategoryHandler,
  updateCategoryHandler,
  updateCategoryByNameHandler,
  deleteCategoryByNameHandler,
  getAllCategoriesHandler,
  getCategoryByIdHandler,
  getCategoryByNameHandler,
  checkCategoryExistsHandler,
} from "../controller/categoryController";

const router = Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: List of all categories
 *       500:
 *         description: Failed to retrieve categories
 */
router.get("/", getAllCategoriesHandler);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *       400:
 *         description: Valid category id is required
 *       404:
 *         description: Category not found
 */
router.get("/:id", getCategoryByIdHandler);

/**
 * @swagger
 * /api/categories/check/{name}:
 *   get:
 *     summary: Check if a category exists by name
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Category name to check
 *         example: electronics
 *     responses:
 *       200:
 *         description: Category existence check result
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
 *                   example: Category exists.
 *                 exists:
 *                   type: boolean
 *                   example: true
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *             examples:
 *               exists:
 *                 value:
 *                   success: true
 *                   message: "Category exists."
 *                   exists: true
 *                   category:
 *                     id: 1
 *                     name: "Electronics"
 *                     description: "Electronic items and gadgets"
 *               not_exists:
 *                 value:
 *                   success: true
 *                   message: "Category does not exist."
 *                   exists: false
 *                   category: null
 *       400:
 *         description: Category name is required
 */
router.get("/check/:name", checkCategoryExistsHandler);

/**
 * @swagger
 * /api/categories/name/{name}:
 *   get:
 *     summary: Get a category by name
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Category name
 *         example: electronics
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *       400:
 *         description: Category name is required
 *       404:
 *         description: Category not found
 */
router.get("/name/:name", getCategoryByNameHandler);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *               description:
 *                 type: string
 *                 example: Electronic items and gadgets
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error or category already exists
 */
router.post("/", createCategoryHandler);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Electronics
 *               description:
 *                 type: string
 *                 example: Updated category description
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Validation error, category not found, or category already exists
 */
router.put("/:id", updateCategoryHandler);

/**
 * @swagger
 * /api/categories/name/{name}:
 *   put:
 *     summary: Update a category by current name
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Current category name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: new gadgets
 *               description:
 *                 type: string
 *                 example: updated gadgets category
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Validation error, category not found, or category already exists
 */
router.put("/name/:name", updateCategoryByNameHandler);

/**
 * @swagger
 * /api/categories/name/{name}:
 *   delete:
 *     summary: Delete a category by name
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Category name
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       400:
 *         description: Category name is required or category not found
 */
router.delete("/name/:name", deleteCategoryByNameHandler);

export default router;