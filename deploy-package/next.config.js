/** @type {import('next').NextConfig} */
const nextConfig = {
  // 开发模式配置（支持API路由）
  // output: 'export', // 注释掉静态导出
  // trailingSlash: true,
  
  // 图片优化配置
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
  
  // 环境变量配置
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || '',
  },
  
  // 开发模式优化
  ...(process.env.NODE_ENV === 'development' && {
    // 减少开发时的编译检查
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
  }),
}

module.exports = nextConfig 