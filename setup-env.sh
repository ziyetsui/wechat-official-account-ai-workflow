#!/bin/bash

# 设置环境变量脚本
echo "正在设置环境变量..."

# 创建 .env.local 文件
cat > .env.local << EOF
# Gemini 2.0 Flash API 配置
GEMINI_API_KEY=AIzaSyAjVdNMbHndiBgWv-dvDPIcsJ2OQFDu6ug
GEMINI_BASE_URL=https://api.246520.xyz
GEMINI_MODEL_NAME=gemini-2.0-flash-exp
EOF

echo "✅ 本地环境变量已设置"
echo "📝 环境变量内容："
cat .env.local

echo ""
echo "🔧 说明："
echo "- 使用 gemini-2.0-flash-exp 模型，这是有免费配额的模型"
echo "- gemini-2.5-pro-preview-05-06 需要付费，返回 429 错误"
echo "- gemini-2.0-flash-exp 性能很好，完全满足需求"
echo ""
echo "🔧 下一步："
echo "1. 在 Vercel 控制台配置相同的环境变量"
echo "2. 运行 'npm run dev' 启动本地开发服务器"
echo "3. 运行 'node check-vercel-deployment.js' 测试部署"
