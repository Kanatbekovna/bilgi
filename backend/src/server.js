import "dotenv/config";
import express from "express";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { crawlAll } from "./services/crawler.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import materialsRoutes from "./routes/materials.js";
import { corsMiddleware } from "./middleware/cors.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 5000;

app.use(helmet());
app.use(corsMiddleware);
app.use(express.json());

// PDF файлдарды статикалык кызмат катары берүү
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Маршруттар
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/materials", materialsRoutes);

// Тест
app.get("/", (req, res) => {
  res.send("Bilgi API иштеп жатат");
});

// Парсерди иштетүү
app.get("/journals", async (req, res) => {
  try {
    const data = await crawlAll();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Жалпы ката handler — эң акырында болушу керек
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
