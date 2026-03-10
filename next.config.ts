/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // เพิ่มบรรทัดนี้
  basePath: '/car-marketplace', // เพิ่มบรรทัดนี้ (ชื่อ repo ของคุณ)
  images: {
    unoptimized: true, // เพิ่มบรรทัดนี้ด้วย เพราะ GitHub Pages ไม่รองรับระบบย่อรูปของ Next.js
    domains: [
      "bferxknatakjymihgsbs.supabase.co"
    ],
  },
}

module.exports = nextConfig
