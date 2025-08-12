import express, { Request, Response } from "express";

import cors from "cors";
import routes from "./routes/index";
import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: "http://localhost:5173", // дозволяємо запити з фронтенда
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());

// Тестовий роут
app.get("/", (req, res) => {
  res.send("Hello from TypeScript backend!");
});

// Підключаємо всі маршрути
app.use(routes);
export default app;
