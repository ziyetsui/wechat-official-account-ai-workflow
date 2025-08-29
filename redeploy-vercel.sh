#!/bin/bash

echo "🚀 重新部署到Vercel"
echo "=================="

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

echo "📦 准备部署包..."
echo ""

# 创建部署包
echo "1. 创建deploy-package目录..."
rm -rf deploy-package
mkdir -p deploy-package

echo "2. 复制必要文件..."
cp -r src deploy-package/
cp -r public deploy-package/ 2>/dev/null || mkdir -p deploy-package/public
cp package.json deploy-package/
cp next.config.js deploy-package/
cp tailwind.config.js deploy-package/
cp postcss.config.js deploy-package/
cp tsconfig.json deploy-package/
cp vercel.json deploy-package/

echo "3. 安装依赖..."
cd deploy-package
npm install --production

echo ""
echo "✅ 部署包准备完成！"
echo ""
echo "📋 下一步操作："
echo "1. 访问Vercel控制台：https://vercel.com/dashboard"
echo "2. 找到你的项目：wechat-official-account-ai-workflow"
echo "3. 点击 Settings > Environment Variables"
echo "4. 确保以下环境变量已配置："
echo ""
echo "   AZURE_OPENAI_BASE_URL=https://gpt-i18n.byteintl.net/gpt/openapi/online/v2/crawl/openai/deployments/gpt_openapi"
echo "   AZURE_OPENAI_API_VERSION=2024-03-01-preview"
echo "   AZURE_OPENAI_API_KEY=I2brwSdmty3dYeCtPIderK1lJzrIHYcc_GPT_AK"
echo "   AZURE_OPENAI_MODEL_NAME=gemini-2.5-pro"
echo "   AZURE_OPENAI_MAX_TOKENS=32000"
echo ""
echo "5. 在Vercel控制台点击 'Redeploy' 重新部署"
echo ""
echo "🔍 部署完成后测试："
echo "   https://wechat-official-account-ai-workflow-ivory.vercel.app/api/health"
echo ""

cd ..

