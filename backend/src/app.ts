import express from "express";
import cors from "cors";
import routes from "./routes/index";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

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
app.use(errorHandler);

export default app;
