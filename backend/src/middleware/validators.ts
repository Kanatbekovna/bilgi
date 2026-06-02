import { Request, Response, NextFunction } from "express";

export function validateRegisterData(data: any) {
  const errors: Array<{ field: string; message: string }> = [];
  if (!data.name || String(data.name).trim().length < 2) {
    errors.push({ field: "name", message: "Имя некорректно или пусто" });
  }
  if (!data.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
    errors.push({ field: "email", message: "Введите корректный email" });
  }
  if (!data.password || String(data.password).length < 6) {
    errors.push({ field: "password", message: "Пароль минимум 6 символов" });
  }
  if (data.phone && !/^\+?[0-9\s\-()]{6,20}$/.test(data.phone)) {
    errors.push({ field: "phone", message: "Формат телефона некорректен" });
  }
  return { valid: errors.length === 0, errors };
}

export function validateUpdateData(data: any) {
  const errors: Array<{ field: string; message: string }> = [];
  if (data.name !== undefined && String(data.name).trim().length < 2) {
    errors.push({ field: "name", message: "Имя некорректно" });
  }
  if (data.email !== undefined && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
    errors.push({ field: "email", message: "Введите корректный email" });
  }
  if (data.password !== undefined && String(data.password).length > 0 && String(data.password).length < 6) {
    errors.push({ field: "password", message: "Пароль минимум 6 символов" });
  }
  if (data.phone && !/^\+?[0-9\s\-()]{6,20}$/.test(data.phone)) {
    errors.push({ field: "phone", message: "Формат телефона некорректен" });
  }
  return { valid: errors.length === 0, errors };
}

export function registerMiddleware(req: Request, res: Response, next: NextFunction) {
  const { valid, errors } = validateRegisterData(req.body);
  if (!valid) return res.status(400).json({ errors });
  next();
}

export function updateMiddleware(req: Request, res: Response, next: NextFunction) {
  const { valid, errors } = validateUpdateData(req.body);
  if (!valid) return res.status(400).json({ errors });
  next();
}
