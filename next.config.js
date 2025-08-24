/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel部署配置
  experimental: {
    // 移除过时的appDir配置
  },
  // 图片优化配置
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
  // 环境变量配置
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || '',
  },
}

module.exports = nextConfig 