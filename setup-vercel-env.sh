#!/bin/bash

echo "🚀 Vercel环境变量配置助手"
echo "=========================="

# 检查是否安装了Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ 未安装Vercel CLI，正在安装..."
    npm install -g vercel
fi

echo ""
echo "📋 请按以下步骤配置环境变量："
echo ""
echo "1. 访问Vercel控制台：https://vercel.com/dashboard"
echo "2. 找到你的项目：wechat-official-account-ai-workflow"
echo "3. 点击 Settings > Environment Variables"
echo "4. 添加以下环境变量："
echo ""

echo "🔧 必需的环境变量："
echo "AZURE_OPENAI_BASE_URL=https://gpt-i18n.byteintl.net/gpt/openapi/online/v2/crawl/openai/deployments/gpt_openapi"
echo "AZURE_OPENAI_API_VERSION=2024-03-01-preview"
echo "AZURE_OPENAI_API_KEY=I2brwSdmty3dYeCtPIderK1lJzrIHYcc_GPT_AK"
echo "AZURE_OPENAI_MODEL_NAME=gemini-2.5-pro"
echo "AZURE_OPENAI_MAX_TOKENS=32000"
echo ""

echo "📝 可选的环境变量（用于发布功能）："
echo "WECHAT_APP_ID=your_wechat_app_id"
echo "WECHAT_APP_SECRET=your_wechat_app_secret"
echo ""

echo "✅ 配置完成后，重新部署项目："
echo "vercel --prod"
echo ""

echo "🔍 测试API连接："
echo "访问：https://your-project-name.vercel.app/api/health"
echo ""

echo "📞 如果仍有问题，请检查："
echo "1. 环境变量是否正确配置"
echo "2. 是否选择了正确的环境（Production）"
echo "3. 项目是否已重新部署"
echo "4. 查看Vercel函数日志"

