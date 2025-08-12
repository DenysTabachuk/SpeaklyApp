import { Request, Response } from "express";
import { prisma } from "../config/db";

export async function register(req: Request, res: Response) {
  try {
    const { nickname: name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password, // TODO: хешувати
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
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

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Невірний email або пароль" });
    }

    res.json({
      message: "Вхід успішний",
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
