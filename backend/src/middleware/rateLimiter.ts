import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Слишком много попыток. Повторите через 15 минут." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: "Слишком много попыток регистрации. Повторите через час." },
  standardHeaders: true,
  legacyHeaders: false,
});
