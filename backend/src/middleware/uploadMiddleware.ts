import multer, { StorageEngine } from "multer";
import { Request } from "express";

// Конфігуруємо як саме multer буде зберігати файли на диску
const storage: StorageEngine = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void // callback
  ) => {
    // cb(null, "uploads/") → немає помилки (null), клади в "uploads/"
    cb(null, "uploads/");
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void // callback
  ) => {
    // cb(null, нове_ім'я)
    // робимо унікальне ім'я: TIMESTAMP-оригінальне_ім'я
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });
