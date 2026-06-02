import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err.status || 500;
  const message = err.message || "Ошибка сервера";

  if (process.env.NODE_ENV !== "production") {
    console.error(`[ERROR] ${req.method} ${req.url} →`, err.message);
  }

  res.status(status).json({ error: message });
}
