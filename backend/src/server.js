import express from "express";
import { crawlAll } from "./services/crawler.js";
import { getAllJournals, getAllArticles, getJournalBySlug, getArticlesByJournalSlug, createUser, getUserByEmail, findOrCreateOAuthUser } from "./db/pool.js";
import cors from "cors";
import bcrypt from "bcryptjs";

const app = express();
const PORT = 5000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json({ limit: "5mb" }));

app.get("/", (req, res) => {
  res.send("Parser API работает");
});

app.get("/journals", async (req, res) => {
  try {
    const journals = await getAllJournals();
    res.json(journals);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// статичный маршрут ПЕРЕД динамическим /:id
app.get("/journals/crawl", async (req, res) => {
  try {
    const stats = await crawlAll();
    res.json(stats);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/journals/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const journal = await getJournalBySlug(slug);
    if (!journal) return res.status(404).json({ error: "Not found" });

    const articles = await getArticlesByJournalSlug(slug);
    res.json({ journal, articles });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/articles", async (req, res) => {
  try {
    const { search = "", limit = "100", offset = "0" } = req.query;
    const articles = await getAllArticles({
      search,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    res.json(articles);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password, avatar, country_city, academic_degree, academic_title, workplace, position, competence, interests, phone, additional_info, files } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "Заполните обязательные поля" });

    const existing = await getUserByEmail(email);
    if (existing)
      return res.status(409).json({ error: "Email уже зарегистрирован" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, passwordHash, avatar, country_city, academic_degree, academic_title, workplace, position, competence, interests, phone, additional_info, files });
    res.status(201).json({ user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Заполните все поля" });

    const user = await getUserByEmail(email);
    if (!user)
      return res.status(401).json({ error: "Неверный email или пароль" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ error: "Неверный email или пароль" });

    const { password_hash, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/auth/google", async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) return res.status(400).json({ error: "Токен берилген жок" });

    const info = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!info.ok) return res.status(401).json({ error: "Google токен жараксыз" });
    const { email, name, picture } = await info.json();
    if (!email) return res.status(401).json({ error: "Google email жок" });

    const user = await findOrCreateOAuthUser({ email, name, avatar: picture });
    res.json({ user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/auth/facebook", async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) return res.status(400).json({ error: "Токен берилген жок" });

    const url = `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`;
    const info = await fetch(url);
    const data = await info.json();
    if (data.error) return res.status(401).json({ error: data.error.message });
    if (!data.email) return res.status(401).json({ error: "Facebook email жок" });

    const user = await findOrCreateOAuthUser({
      email: data.email,
      name: data.name,
      avatar: data.picture?.data?.url || null,
    });
    res.json({ user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
