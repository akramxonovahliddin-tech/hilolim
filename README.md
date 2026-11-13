# Hilolim — qabulga yozilish (Telegram Mini App)

Papka tuzilishi:
- public/index.html — frontend (forma)
- public/logo.jpg — logotip
- server.js — backend (Supabase'ga saqlaydi + Telegram adminiga xabar yuboradi)
- supabase/schema.sql — database schema

## Environment variables (hosting panelida)
- BOT_TOKEN — @BotFather token
- ADMIN_CHAT_ID — admin chat ID
- SUPABASE_URL — Supabase project URL
- SUPABASE_SECRET_KEY — Supabase Secret key (serverda saqlang, GitHub/frontendga qo'ymang)

## Deploy
Render: Build command `npm install`, Start command `npm start`.
Environment variables'ni Render dashboard'da kiriting.

## Telegram
Hosting HTTPS manzilini @BotFather > /newapp orqali Mini App'ga qo'shing.

Arizalar: Supabase > Table Editor > arizalar.
