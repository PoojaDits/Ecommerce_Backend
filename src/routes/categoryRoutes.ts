import { Router } from "express";
import { createCategoryHandler, updateCategoryHandler ,updateCategoryByNameHandler,deleteCategoryByNameHandler} from "../controller/categoryController"

const router = Router();

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
 *                 example: "Electronics"
 *               description:
 *                 type: string
 *                 example: "Electronic items and gadgets"
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
 *                 example: "Updated Electronics"
 *               description:
 *                 type: string
 *                 example: "Updated category description"
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
 *         example: "gadgets"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "new gadgets"
 *               description:
 *                 type: string
 *                 example: "updated gadgets category"
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
 *         example: "gadgets"
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       400:
 *         description: Category name is required or category not found
 */
router.delete("/name/:name", deleteCategoryByNameHandler);

export default router;
