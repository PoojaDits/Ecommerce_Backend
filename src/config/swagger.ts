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
      // ========== AUTH SCHEMAS ==========

      AuthResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Operation successful" },
          user: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              firstName: { type: "string", example: "Pooja" },
              lastName: { type: "string", example: "Joshi" },
              email: {
                type: "string",
                format: "email",
                example: "jspuja@example.com",
              },
              role: {
                type: "string",
                enum: ["admin", "customer", "vendor"],
                example: "customer",
              },
              isActive: { type: "boolean", example: true },
              createdAt: {
                type: "string",
                format: "date-time",
                example: "2026-06-01T08:00:00.000Z",
              },
            },
          },
          token: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIs...",
            description: "JWT token (only present on login)",
          },
        },
      },

      RegisterRequest: {
        type: "object",
        required: ["firstName", "lastName", "email", "password"],
        properties: {
          firstName: { type: "string", example: "Pooja" },
          lastName: { type: "string", example: "Joshi" },
          email: {
            type: "string",
            format: "email",
            example: "jspuja@example.com",
          },
          password: {
            type: "string",
            format: "password",
            example: "SecurePass123",
          },
          role: {
            type: "string",
            enum: ["admin", "customer", "vendor"],
            default: "customer",
            example: "customer",
          },
        },
      },

      VerifyOtpRequest: {
        type: "object",
        required: ["email", "otp"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "jspuja@example.com",
          },
          otp: { type: "string", example: "123456" },
        },
      },

      ResendOtpRequest: {
        type: "object",
        required: ["email"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "jspuja@example.com",
          },
        },
      },

      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "jspuja@example.com",
          },
          password: {
            type: "string",
            format: "password",
            example: "SecurePass123",
          },
        },
      },

      LoginResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Login successful" },
          user: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              firstName: { type: "string", example: "Pooja" },
              lastName: { type: "string", example: "Joshi" },
              email: {
                type: "string",
                format: "email",
                example: "jspuja@example.com",
              },
              role: {
                type: "string",
                enum: ["admin", "customer", "vendor"],
                example: "customer",
              },
              isActive: { type: "boolean", example: true },
              createdAt: {
                type: "string",
                format: "date-time",
                example: "2026-06-01T08:00:00.000Z",
              },
            },
          },
          token: {
            type: "string",
            example: "eyJhbGciOiJIUzI1NiIs...",
          },
        },
      },

      ForgotPasswordRequest: {
        type: "object",
        required: ["email"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "jspuja@example.com",
          },
        },
      },

      ResetPasswordRequest: {
        type: "object",
        required: ["email", "otp", "newPassword"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "jspuja@example.com",
          },
          otp: { type: "string", example: "123456" },
          newPassword: {
            type: "string",
            format: "password",
            example: "NewSecurePass456",
          },
        },
      },

      ChangePasswordRequest: {
        type: "object",
        required: ["currentPassword", "newPassword"],
        properties: {
          currentPassword: {
            type: "string",
            format: "password",
            example: "OldPass123",
          },
          newPassword: {
            type: "string",
            format: "password",
            example: "NewPass@456",
          },
        },
      },

     

      ProductsListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: {
            type: "string",
            example: "Products retrieved successfully.",
          },
          products: {
            type: "array",
            items: { $ref: "#/components/schemas/Product" },
          },
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
          image: {
            type: "string",
            example: "/uploads/products/product-123.jpg",
            nullable: true,
          },
          isActive: { type: "boolean", example: true },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },

      CreateProductRequest: {
        type: "object",
        required: ["name", "price", "stock", "storeId", "categoryId"],
        properties: {
          name: { type: "string", example: "Sample Product" },
          description: { type: "string", example: "A great product" },
          price: { type: "number", example: 19.99 },
          stock: { type: "integer", example: 100 },
          categoryId: { type: "integer", example: 2 },
          storeId: { type: "integer", example: 1 },
          isActive: { type: "boolean", example: true },
        },
      },

      ProductResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: {
            type: "string",
            example: "Product retrieved successfully.",
          },
          product: { $ref: "#/components/schemas/Product" },
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
          isActive: { type: "boolean", example: true },
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
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/CartItem" },
          },
          totalItems: { type: "integer", example: 3 },
          totalAmount: { type: "number", example: 59.97 },
        },
      },

      CartResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: {
            type: "string",
            example: "Cart retrieved successfully.",
          },
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

    

      Category: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Electronics" },
          description: {
            type: "string",
            example: "All electronic items",
            nullable: true,
          },
        },
      },

      CategoryResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Category retrieved successfully." },
          category: { $ref: "#/components/schemas/Category" },
        },
      },

      CategoriesListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Categories retrieved successfully." },
          categories: {
            type: "array",
            items: { $ref: "#/components/schemas/Category" },
          },
        },
      },

     

      Store: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          storeName: { type: "string", example: "My Electronics Store" },
          storeDescription: {
            type: "string",
            example: "Best electronics in town",
            nullable: true,
          },
          storeLocation: { type: "string", example: "Mumbai, India" },
          storeContact: {
            type: "string",
            example: "+919876543210",
            nullable: true,
          },
          storeEmail: {
            type: "string",
            format: "email",
            example: "store@example.com",
          },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },

      StoreResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Store retrieved successfully." },
          store: { $ref: "#/components/schemas/Store" },
        },
      },

      StoresListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Stores retrieved successfully." },
          stores: {
            type: "array",
            items: { $ref: "#/components/schemas/Store" },
          },
        },
      },

      

      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          uuid: {
            type: "string",
            format: "uuid",
            example: "550e8400-e29b-41d4-a716-446655440000",
          },
          firstName: { type: "string", example: "Pooja" },
          lastName: { type: "string", example: "Joshi" },
          email: {
            type: "string",
            format: "email",
            example: "jspuja@example.com",
          },
          role: {
            type: "string",
            enum: ["admin", "customer", "vendor"],
            example: "customer",
          },
          isActive: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },

      UserResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "User retrieved successfully." },
          user: { $ref: "#/components/schemas/User" },
        },
      },

      UsersListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Users retrieved successfully." },
          users: {
            type: "array",
            items: { $ref: "#/components/schemas/User" },
          },
        },
      },

      

      SuccessResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Operation successful" },
        },
      },

      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Error message" },
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
