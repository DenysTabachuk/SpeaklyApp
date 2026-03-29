import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    name: string;
    email: string;
  };
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as AuthRequest["user"];
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
}
