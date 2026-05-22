import { Router } from "express";
import multer from "multer";
import path from "path";
import { requireAdmin } from "../middleware/auth.js";
import {
  createMaterial,
  getAllMaterials,
  deleteMaterial,
  getAllUsers,
  updateUserRole,
} from "../controllers/adminController.js";

const router = Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Жалаң PDF файл жүктөлөт"));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/materials", requireAdmin, upload.single("pdf"), createMaterial);
router.get("/materials", requireAdmin, getAllMaterials);
router.delete("/materials/:id", requireAdmin, deleteMaterial);

router.get("/users", requireAdmin, getAllUsers);
router.patch("/users/:id/role", requireAdmin, updateUserRole);

export default router;
