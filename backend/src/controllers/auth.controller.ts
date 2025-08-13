import { Request, Response } from "express";
import { prisma } from "../config/db";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "process";

const JWT_SECRET = process.env.JWT_SECRET;

export async function register(req: Request, res: Response) {
  try {
    const { nickname: name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Хешуємо пароль (наприклад, 10 раундів)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      // Помилка унікального обмеження — наприклад, email вже існує
      return res
        .status(409)
        .json({ error: "Користувач з таким email вже існує" });
    }

    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email та пароль обов'язкові" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res
        .status(401)
        .json({ error: "Користувача з таким email не знайдено" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Невірний пароль" });
    }

    if (!JWT_SECRET) {
      return res
        .status(500)
        .json({ error: "JWT_SECRET is not defined in environment variables" });
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "24h" } // токен буде дійсний 1 годину
    );

    res.json({
      message: "Вхід успішний",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
}
