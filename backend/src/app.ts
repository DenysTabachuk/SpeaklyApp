import express from "express";
import cors from "cors";
import routes from "./routes/index";
import { errorHandler } from "./middleware/errorHandler";
import { env } from "./config/env";

const app = express();

app.use(
  cors({
    origin: env.frontendOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json()); // ✅ для JSON
app.use(express.urlencoded({ extended: true })); // ✅ якщо колись прийде form-urlencoded

// Статика для завантажених файлів
app.use("/uploads", express.static("uploads"));

// Тестовий роут
app.get("/", (req, res) => {
  res.send("Hello from TypeScript backend!");
});

// Підключаємо маршрути
app.use(routes);

// Middleware для обробки помилок
app.use(errorHandler);

export default app;
