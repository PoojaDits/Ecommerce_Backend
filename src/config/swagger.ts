import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";


const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "E-commerce API",
    version: "1.0.0",
    description: "API documentation",
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3001}`,
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "JWT Authorization header using the Bearer scheme. Example: Bearer eyJhbGciOiJIUzI1NiIs...",
      },
    },
    schemas: {

      RegisterRequest: {
        type: "object",
        required: ["firstName", "lastName", "email", "password"],
        properties: {
          firstName: { type: "string", example: "Pooja" },
          lastName: { type: "string", example: "Joshi" },
          email: { type: "string", format: "email", example: "jspuja@example.com" },
          password: { type: "string", format: "password", example: "SecurePass123" },
          role: { type: "string", enum: ["admin", "customer", "vendor"], default: "customer", example: "customer" },
        },
      },

      ProductsListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Products retrieved successfully." },
          products: { type: "array", items: { $ref: "#/components/schemas/Product" } },
        },
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Sample Product" },
          description: { type: "string", example: "A great product" },
          price: { type: "number", example: 19.99 },
          stock: { type: "integer", example: 100 },
          image: { type: "string", example: "/uploads/products/product-123.jpg" },
          isActive: { type: "boolean", example: true },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" }
        },
      },
      CreateProductRequest: {
        type: "object",
        required: ["name", "description", "price", "stock", "categoryId"],
        properties: {
          name: { type: "string", example: "Sample Product" },
          description: { type: "string", example: "A great product" },
          price: { type: "number", example: 19.99 },
          stock: { type: "integer", example: 100 },
          categoryId: { type: "integer", example: 2 },
          storeId: { type: "integer", example: 1 },
          isActive: { type: "boolean", example: true }
        },
      },
      ProductResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Product retrieved successfully." },
          product: { $ref: "#/components/schemas/Product" }
        },
      },
      UpdateProductRequest: {
        type: "object",
        properties: {
          name: { type: "string", example: "Updated Name" },
          description: { type: "string", example: "Updated description" },
          price: { type: "number", example: 29.99 },
          stock: { type: "integer", example: 50 },
          categoryId: { type: "integer", example: 2 },
          isActive: { type: "boolean", example: true }
        },
      },
      CartItem: {
        type: "object",
        properties: {
          id: { type: "integer", example: 5 },
          quantity: { type: "integer", example: 2 },
          subtotal: { type: "number", example: 39.98 },
          product: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              name: { type: "string", example: "Sample Product" },
              price: { type: "number", example: 19.99 },
              stock: { type: "integer", example: 100 },
            },
          },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      Cart: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          items: { type: "array", items: { $ref: "#/components/schemas/CartItem" } },
          totalItems: { type: "integer", example: 3 },
          totalAmount: { type: "number", example: 59.97 },
        },
      },
      CartResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Cart retrieved successfully." },
          cart: { $ref: "#/components/schemas/Cart" },
        },
      },
      AddCartItemRequest: {
        type: "object",
        required: ["productId", "quantity"],
        properties: {
          productId: { type: "integer", example: 1 },
          quantity: { type: "integer", example: 2 },
        },
      },
      UpdateCartItemRequest: {
        type: "object",
        required: ["quantity"],
        properties: {
          quantity: { type: "integer", example: 3 },
        },
      },
      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Operation successful" }
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Error message" }
        },
      },
    },
  },
  security: [{ BearerAuth: [] }],
};


const options: swaggerJSDoc.Options = {
  definition: swaggerDefinition,
  apis: ["./src/routes/*.ts"],
};


const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express): void => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );
};
