#!/bin/bash

echo "🔧 开始修复部署问题..."

# 1. 创建环境变量文件
echo "📝 创建 .env.local 文件..."
cat > .env.local << 'EOF'
# Azure OpenAI Configuration
AZURE_OPENAI_BASE_URL=https://gpt-i18n.byteintl.net/gpt/openapi/online/v2/crawl/openai/deployments/gpt_openapi
AZURE_OPENAI_API_VERSION=2024-03-01-preview
AZURE_OPENAI_API_KEY=I2brwSdmty3dYeCtPIderK1lJzrIHYcc_GPT_AK
AZURE_OPENAI_MODEL_NAME=gemini-2.5-pro
AZURE_OPENAI_MAX_TOKENS=32000

# 微信公众号配置
# 请将下面的值替换为您的实际配置
WECHAT_APP_ID=wxc66e3754c009becc
WECHAT_APP_SECRET=your_app_secret_here

# 注意：
# 1. 请将 your_app_secret_here 替换为您的实际开发者密码
# 2. 确保您的服务器IP已添加到微信公众号的IP白名单中
# 3. 开发者密码具有极高安全性，请妥善保管
EOF

echo "✅ .env.local 文件已创建"

# 2. 更新 package.json 确保有正确的脚本
echo "📦 检查 package.json..."
if ! grep -q '"build"' package.json; then
    echo "❌ package.json 缺少 build 脚本"
    exit 1
fi

if ! grep -q '"start"' package.json; then
    echo "❌ package.json 缺少 start 脚本"
    exit 1
fi

echo "✅ package.json 配置正确"

# 3. 重新创建部署包
echo "🔄 重新创建部署包..."
./deploy.sh

# 4. 显示修复后的检查结果
echo ""
echo "🔍 修复后检查..."
node check-deployment.js

echo ""
echo "🎉 修复完成！"
echo ""
echo "📋 下一步操作："
echo "1. 编辑 .env.local 文件，将 WECHAT_APP_SECRET 替换为您的实际开发者密码"
echo "2. 登录微信公众平台配置IP白名单"
echo "3. 使用 wechat-ai-workflow-deploy.zip 文件部署到微信云托管"
echo ""
echo "📖 详细步骤请参考："
echo "   - DEPLOYMENT.md (部署指南)"
echo "   - WECHAT_SETUP.md (微信配置)" 