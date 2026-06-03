import { Request } from "express";

export const buildFileUrl = (req: Request, filename: string): string => {
  const baseUrl =
    process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

  return `${baseUrl}/uploads/products/${filename}`;
};