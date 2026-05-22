import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { loginLimiter, registerLimiter } from "../middleware/rateLimiter.js";
import {
  register,
  login,
  getMe,
  updateMe,
  deleteMe,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.get("/me", requireAuth, getMe);
router.put("/me", requireAuth, updateMe);
router.delete("/me", requireAuth, deleteMe);

export default router;
