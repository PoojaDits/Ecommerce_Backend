import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJSDoc.Options = {
  definition: {
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
              example: "jspuja02@gmail.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "SecurePass123",
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
              example: "NewSecurePass@123",
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
              example: "NewSecurePass@456",
            },
          },
        },
        // ─── Auth Responses ──────────────────────────────────────────
        AuthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: {
              type: "string",
              example: "OTP sent successfully.",
            },
            user: { $ref: "#/components/schemas/User" },
          },
        },

        LoginResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Login successful" },
            token: { type: "string", example: "jwt_token_here" },
            user: { $ref: "#/components/schemas/User" },
          },
        },

        ChangePasswordResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: {
              type: "string",
              example: "Password changed successfully.",
            },
          },
        },

        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: {
              type: "string",
              example: "Error explanation message.",
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
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-05-27T10:30:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-05-27T10:30:00Z",
            },
          },
        },

        Category: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Electronics" },
            description: {
              type: "string",
              example: "Electronic items and gadgets",
            },
            slug: { type: "string", example: "electronics" },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2026-05-27T10:30:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2026-05-27T10:30:00Z",
            },
          },
        },
      
        Store: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            storeName: {
              type: "string",
              example: "My Electronics Store",
            },
            storeDescription: {
              type: "string",
              example: "Best electronics shop in town",
            },
            storeLocation: {
              type: "string",
              example: "42 Market Street, Mumbai",
            },
            storeContact: {
              type: "string",
              example: "+919876543210",
            },
            storeEmail: {
              type: "string",
              format: "email",
              example: "mystore@example.com",
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2026-05-29T10:30:00Z",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              example: "2026-05-29T10:30:00Z",
            },
            user: { $ref: "#/components/schemas/User" },
          },
        },

      
        
      },
    },

    security: [{ BearerAuth: [] }],
  },

  apis: ["./src/routes/*.{ts,js}"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express): void => {
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );
};
