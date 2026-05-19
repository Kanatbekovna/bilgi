import express from "express";
import { crawlAll } from "./services/crawler.js";

const app = express();
const PORT = 5000;

// тест
app.get("/", (req, res) => {
  res.send("Parser API работает");
});

// парсинг всего журнала

app.get("/journals", async (req, res) => {
  try {
    const data = await crawlAll();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
