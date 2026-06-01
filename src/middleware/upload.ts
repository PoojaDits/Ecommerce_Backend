

import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

const uploadFolder = path.join(__dirname, "..", "..", "public", "uploads", "products");

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadFolder);
  },

  
  filename: function (_req, file, cb) {
    const uniqueName =
      "product-" + Date.now() + "-" + Math.round(Math.random() * 1e6);

    const fileExtension = path.extname(file.originalname);

    cb(null, uniqueName + fileExtension);
  },
});
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const isExtOk = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isMimeOk = allowedTypes.test(file.mimetype);

  if (isExtOk && isMimeOk) {
    cb(null, true); 
  } else {
    cb(new Error("Only image files are allowed (jpg, jpeg, png, gif, webp)."));
  }
};
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
