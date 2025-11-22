import jwt from "jsonwebtoken"
import {customRequest} from "../types.js"
import { NextFunction, Response } from "express";

export function verifyToken(req: customRequest, res: Response, next: NextFunction) {
  const header = req.header("Authorization");
  if (!header) return res.status(401).json({ error: "Access denied" });

  const token = header.startsWith("Bearer ") ? header.slice(7) : header;

  try {
    const decoded = jwt.verify(token, "your-secret-key");
    
    if (typeof decoded === "string" || !("userEmail" in decoded)) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.userEmail = decoded.userEmail as string;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
