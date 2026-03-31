import express from "express";
import cors from "cors";
import routes from "./routes/index";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";
import { env } from "./config/env";

const app = express();

app.use(
  cors({
    origin: env.frontendOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.get("/", (_req, res) => {
  res.send("Hello from TypeScript backend!");
});

app.use(routes);
app.use(errorHandler);

export default app;
