import fs from "fs";
import path from "path";

// API endpoint: https://<project-name>.vercel.app/api/save
export default async function handler(req, res) {
  // Izinkan akses dari domain manapun (biar bisa dipanggil dari web lain)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Ambil data dari body
    const data = req.body;
    const fileName = `Geber_${Date.now()}.geber`;

    // Tentukan folder tempat menyimpan file (folder public/files)
    const dir = path.join(process.cwd(), "public", "files");

    // Kalau folder belum ada, buat dulu
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Simpan data ke file .geber
    const filePath = path.join(dir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    // Bikin URL publik untuk file yang baru disimpan
    const fileUrl = `https://${req.headers.host}/files/${fileName}`;

    // Kirim link-nya balik ke client
    res.status(200).json({ url: fileUrl });
  } catch (err) {
    console.error("Save failed:", err);
    res.status(500).json({ error: "Failed to save project" });
  }
}
