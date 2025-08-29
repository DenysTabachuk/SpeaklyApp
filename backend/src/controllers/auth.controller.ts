import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

function generateTokens(payload: object) {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "30m" });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
}

function setRefreshCookie(res: Response, refreshToken: string) {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
  });
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { nickname: name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Всі поля обов'язкові" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res
        .status(409)
        .json({ error: "Користувач з таким email вже існує" });
    }
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Неправильні дані для входу" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Невірний email або пароль" });
    }

    const payload = { userId: user.id, email: user.email, name: user.name };
    const { accessToken, refreshToken } = generateTokens(payload);

    setRefreshCookie(res, refreshToken);

    res.json({
      token: accessToken,
      user: payload,
    });
  } catch (error) {
    next(error);
  }
}

export function refreshToken(req: Request, res: Response) {
  const existingRefreshToken = req.cookies.refreshToken;
  if (!existingRefreshToken) {
    return res.status(401).json({ error: "Refresh token відсутній" });
  }

  try {
    const decoded = jwt.verify(existingRefreshToken, JWT_REFRESH_SECRET) as {
      userId: number;
      email: string;
      name: string;
    };

    const payload = {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
    };
    const { accessToken, refreshToken } = generateTokens(payload);

    setRefreshCookie(res, refreshToken);

    res.json({ token: accessToken });
  } catch (error) {
    return res.status(403).json({ error: "Недійсний refresh token" });
  }
}
