import jwt from "jsonwebtoken"
import {customRequest} from "../types.js"
import { NextFunction, Response } from "express";

export function verifyToken(req: customRequest, res: Response, next: NextFunction) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, "your-secret-key");
    if (typeof decoded === "string" || !("userId" in decoded)) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.userId = decoded.userId as string;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
