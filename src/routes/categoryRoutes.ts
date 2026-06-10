import { Router } from "express";
import { createCategoryHandler, updateCategoryHandler, deleteCategoryHandler, getAllCategoriesHandler, getCategoryByIdHandler, checkCategoryExistsHandler,} from "../controller/categoryController";
import authenticateUser from "../middleware/auth.Middleware";
import authorizeRoles from "../middleware/roleGuard";

const router = Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories (public)
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: List of all categories
 *       500:
 *         description: Failed to retrieve categories
 *   post:
 *     summary: Create a new category (admin only)
 *     tags:
 *       - Categories
 *     security:
 *       - BearerAuth: []
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
router.get("/", getAllCategoriesHandler);
router.post("/", authenticateUser, authorizeRoles("admin"), createCategoryHandler);

/**
 * @swagger
 * /api/categories/check/{name}:
 *   get:
 *     summary: Check if a category exists by name (public)
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
 *       400:
 *         description: Category name is required
 */
router.get("/check/:name", checkCategoryExistsHandler);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a category by ID (public)
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
 *   put:
 *     summary: Update a category (admin only)
 *     tags:
 *       - Categories
 *     security:
 *       - BearerAuth: []
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Validation error
 *   delete:
 *     summary: Delete a category by ID (admin only)
 *     tags:
 *       - Categories
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       400:
 *         description: Valid category id is required
 *       404:
 *         description: Category not found
 */
router.get("/:id", getCategoryByIdHandler);
router.put("/:id", authenticateUser, authorizeRoles("admin"), updateCategoryHandler);
router.delete("/:id", authenticateUser, authorizeRoles("admin"), deleteCategoryHandler);

export default router;
