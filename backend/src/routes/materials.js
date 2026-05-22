import { Router } from "express";
import { getMaterials, getMaterialById } from "../controllers/materialsController.js";

const router = Router();

router.get("/", getMaterials);
router.get("/:id", getMaterialById);

export default router;
