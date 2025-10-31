// ======== GEBER SAVE API - VERCEL BLOB VERSION =========
// by ChatGPT (fix for EROFS / read-only file system error)

import { put } from '@vercel/blob';

export default async function handler(req, res) {
  // Izinkan akses dari mana saja (biar bisa dipanggil dari web/apk)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    // Ambil data project dari body
    const data = JSON.stringify(req.body, null, 2);
    const fileName = `Geber_${Date.now()}.geber`;

    // Simpan ke Vercel Blob Storage
    const blob = await put(fileName, data, {
      access: 'public',
      contentType: 'application/json'
    });

    // Kirim link balik ke client
    return res.status(200).json({ url: blob.url });

  } catch (err) {
    console.error("Save failed:", err);
    return res.status(500).json({ error: "Failed to save project" });
  }
}
