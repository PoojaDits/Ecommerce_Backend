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
        description: "development server",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            uuid: {
              type: "string",
              format: "uuid",
            },
            firstName: {
              type: "string",
              example: "Pooja",
            },
            lastName: {
              type: "string",
              example: "Joshi",
            },
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
            isActive: {
              type: "boolean",
              example: false,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["firstName", "lastName", "email", "password"],
          properties: {
            firstName: {
              type: "string",
              example: "Pooja",
            },
            lastName: {
              type: "string",
              example: "Joshi",
            },
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
            otp: {
              type: "string",
              example: "123456",
            },
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
        ForgotPasswordVerifyOtpRequest: {
          type: "object",
          required: ["email", "otp"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "jspuja@example.com",
            },
            otp: {
              type: "string",
              example: "123456",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "OTP sent successfully.",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error explanation message.",
            },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Login successful",
            },
            token: {
              type: "string",
              example: "jwt_token_here",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },
   LogoutResponse: {
  type: "object",
  properties: {
    success: {
      type: "boolean",
      example: true,
    },
    message: {
      type: "string",
      example: "Logout successful",
    },
  },
},
ForgotPasswordResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "OTP sent to your email for forgot password verification.",
            },
          },
        },
        ForgotPasswordVerifyOtpResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Forgot password OTP verified successfully.",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.{ts,js}"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express): void => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
