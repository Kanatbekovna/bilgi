import express from "express";
import { crawlAll } from "./services/crawler.js";

const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Multi Parser API running");
});

// ALL
app.get("/crawl", async (req, res) => {
  const result = await crawlAll("all");
  res.json(result);
});

// ONLY VAK
app.get("/crawl/vak", async (req, res) => {
  const result = await crawlAll("vak");
  res.json(result);
});

// ONLY OSHSU
app.get("/crawl/oshsu", async (req, res) => {
  const result = await crawlAll("oshsu");
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
