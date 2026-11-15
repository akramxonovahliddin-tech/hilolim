const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const COURSES = { fonetika: "Fonetika guruhi", grammatika: "Grammatika guruhi" };
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok:false, error:"Method not allowed" });
  const { firstName, lastName, phone, course } = req.body || {};
  const f=String(firstName||"").trim().slice(0,50), l=String(lastName||"").trim().slice(0,50), p=String(phone||"").trim().slice(0,20);
  if (!f || !l || !/^\\+?\\d[\\d\\s()-]{8,17}$/.test(p) || !COURSES[course]) return res.status(400).json({ok:false,error:"Ma'lumotlar noto'g'ri"});
  const text=`📩 <b>Yangi qabul arizasi</b>\\n\\n👤 Ism: ${esc(f)}\\n👤 Familiya: ${esc(l)}\\n📞 Telefon: ${esc(p)}\\n📚 Arab tili: ${COURSES[course]}`;
  let saved=false, sent=false;
  try { const r=await fetch(`${process.env.SUPABASE_URL}/rest/v1/arizalar`,{method:"POST",headers:{"Content-Type":"application/json",apikey:process.env.SUPABASE_SECRET_KEY,Authorization:`Bearer ${process.env.SUPABASE_SECRET_KEY}`,Prefer:"return=minimal"},body:JSON.stringify({ism:f,familiya:l,telefon:p,kurs:course})}); if(!r.ok) throw new Error(await r.text()); saved=true; } catch(e){console.error("Supabase:",e.message);}
  try { const r=await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:process.env.ADMIN_CHAT_ID,text,parse_mode:"HTML"})}); const d=await r.json(); if(!d.ok) throw new Error(d.description); sent=true;}catch(e){console.error("Telegram:",e.message);}
  if(saved||sent) return res.json({ok:true}); return res.status(500).json({ok:false,error:"Yuborib bo'lmadi"});
}