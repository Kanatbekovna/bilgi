import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization as string | undefined;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Требуется аутентификация" });
  }

  const token = authHeader.split(" ")[1];
  try {
    (req as any).user = jwt.verify(token, process.env.JWT_SECRET as string);
    next();
  } catch {
    return res.status(401).json({ error: "Токен недействителен или просрочен" });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if ((req as any).user.role !== "admin") {
      return res.status(403).json({ error: "Доступ запрещён" });
    }
    next();
  });
}
