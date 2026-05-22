import rateLimit from "express-rate-limit";

// Login үчүн: 15 мүнөттө 10 жолудан ашык аракет кылууга болбойт
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Өтө көп аракет. 15 мүнөттөн кийин кайталаңыз." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Register үчүн: 1 сааттa 20 аракет
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: "Өтө көп тизилүү аракети. Бир сааттан кийин кайталаңыз." },
  standardHeaders: true,
  legacyHeaders: false,
});
