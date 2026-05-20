import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "E-commerce API",
            version: "1.0.0",
            description: "API documentation for the E-commerce backend",
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
                        id: { type: "integer", example: 1 },
                        uuid: { type: "string", format: "uuid" },
                        firstName: { type: "string", example: "John" },
                        lastName: { type: "string", example: "Doe" },
                        email: { type: "string", format: "email", example: "john.doe@example.com" },
                        role: { type: "string", enum: ["admin", "customer", "vendor"], example: "customer" },
                        isActive: { type: "boolean", example: false },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                RegisterRequest: {
                    type: "object",
                    required: ["firstName", "lastName", "email", "password"],
                    properties: {
                        firstName: { type: "string", example: "John" },
                        lastName: { type: "string", example: "Doe" },
                        email: { type: "string", format: "email", example: "john.doe@example.com" },
                        password: { type: "string", format: "password", example: "SecurePass123" },
                        role: { type: "string", enum: ["admin", "customer", "vendor"], default: "customer" },
                    },
                },
                VerifyOtpRequest: {
                    type: "object",
                    required: ["email", "otp"],
                    properties: {
                        email: { type: "string", format: "email", example: "john.doe@example.com" },
                        otp: { type: "string", example: "123456" },
                    },
                },
                ResendOtpRequest: {
                    type: "object",
                    required: ["email"],
                    properties: {
                        email: { type: "string", format: "email", example: "john.doe@example.com" },
                    },
                },
                AuthResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "OTP sent successfully." },
                        user: { $ref: "#/components/schemas/User" },
                    },
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        message: { type: "string", example: "Error explanation message." },
                    },
                },
            },
        },
    },
    apis: ["./src/routes/*.{ts,js}"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express): void => {
    app.use(
        "/docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec)
    );
};
