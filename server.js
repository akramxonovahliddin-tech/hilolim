const express = require("express");
const path = require("path");

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
const PORT = process.env.PORT || 3000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

const COURSES = { fonetika: "Fonetika guruhi", grammatika: "Grammatika guruhi" };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/enroll", async (req, res) => {
  const { firstName, lastName, phone, course } = req.body || {};
  const f = String(firstName || "").trim().slice(0, 50);
  const l = String(lastName || "").trim().slice(0, 50);
  const p = String(phone || "").trim().slice(0, 20);
  if (!f || !l || !/^\+?\d[\d\s()-]{8,17}$/.test(p) || !COURSES[course])
    return res.status(400).json({ ok: false, error: "Ma'lumotlar noto'g'ri" });

  const text = `📩 <b>Yangi qabul arizasi</b>\n\n👤 Ism: ${esc(f)}\n👤 Familiya: ${esc(l)}\n📞 Telefon: ${esc(p)}\n📚 Arab tili: ${COURSES[course]}`;
  let saved = false, sent = false;
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/arizalar`, {
      method: "POST", headers: { "Content-Type": "application/json", apikey: SUPABASE_SECRET_KEY,
        Authorization: `Bearer ${SUPABASE_SECRET_KEY}`, Prefer: "return=minimal" },
      body: JSON.stringify({ ism: f, familiya: l, telefon: p, kurs: course }),
    });
    if (!r.ok) throw new Error(await r.text());
    saved = true;
  } catch (e) { console.error("Supabase xatosi:", e.message); }
  try {
    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST", headers: { "Content-Type": "application/json },
      body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text, parse_mode: "HTML" }),
    });
    const data = await r.json(); if (!data.ok) throw new Error(data.description); sent = true;
  } catch (e) { console.error("Telegram xatosi:", e.message); }
  if (saved || sent) return res.json({ ok: true });
  res.status(500).json({ ok: false, error: "Yuborib bo'lmadi" });
});
app.listen(PORT, () => console.log("Hilolim mini app: port " + PORT));