/** @type {import('next').NextConfig} */
const nextConfig = {
  // 支持静态导出（用于GitHub Pages）
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // 禁用服务端功能（因为静态导出不支持）
  experimental: {
    // 移除过时的appDir配置
  },
}

module.exports = nextConfig 