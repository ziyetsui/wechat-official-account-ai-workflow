#!/bin/bash

echo "🚀 Vercel环境变量配置脚本"
echo "=================================================="
echo ""

# 检查是否安装了Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI未安装，正在安装..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo "❌ Vercel CLI安装失败，请手动安装：npm install -g vercel"
        exit 1
    fi
    echo "✅ Vercel CLI安装成功"
fi

echo "📋 需要配置的环境变量："
echo ""
echo "1. AZURE_OPENAI_BASE_URL"
echo "   值: https://gpt-i18n.byteintl.net/gpt/openapi/online/v2/crawl/openai/deployments/gpt_openapi"
echo ""
echo "2. AZURE_OPENAI_API_VERSION"
echo "   值: 2024-03-01-preview"
echo ""
echo "3. AZURE_OPENAI_API_KEY"
echo "   值: I2brwSdmty3dYeCtPIderK1lJzrIHYcc_GPT_AK"
echo ""
echo "4. AZURE_OPENAI_MODEL_NAME"
echo "   值: gemini-2.5-pro"
echo ""
echo "5. AZURE_OPENAI_MAX_TOKENS"
echo "   值: 32000"
echo ""

read -p "是否要自动配置这些环境变量？(y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔧 正在配置环境变量..."
    
    # 登录Vercel（如果需要）
    echo "检查Vercel登录状态..."
    if ! vercel whoami &> /dev/null; then
        echo "需要登录Vercel，请按照提示操作..."
        vercel login
    fi
    
    # 设置环境变量
    echo "设置 AZURE_OPENAI_BASE_URL..."
    vercel env add AZURE_OPENAI_BASE_URL production <<< "https://gpt-i18n.byteintl.net/gpt/openapi/online/v2/crawl/openai/deployments/gpt_openapi"
    
    echo "设置 AZURE_OPENAI_API_VERSION..."
    vercel env add AZURE_OPENAI_API_VERSION production <<< "2024-03-01-preview"
    
    echo "设置 AZURE_OPENAI_API_KEY..."
    vercel env add AZURE_OPENAI_API_KEY production <<< "I2brwSdmty3dYeCtPIderK1lJzrIHYcc_GPT_AK"
    
    echo "设置 AZURE_OPENAI_MODEL_NAME..."
    vercel env add AZURE_OPENAI_MODEL_NAME production <<< "gemini-2.5-pro"
    
    echo "设置 AZURE_OPENAI_MAX_TOKENS..."
    vercel env add AZURE_OPENAI_MAX_TOKENS production <<< "32000"
    
    echo ""
    echo "✅ 环境变量配置完成！"
    echo ""
    echo "🔄 正在重新部署项目..."
    vercel --prod
    
    echo ""
    echo "🎉 配置完成！"
    echo "网站地址: https://wechat-official-account-ai-workflow-ivory.vercel.app"
    echo "健康检查: https://wechat-official-account-ai-workflow-ivory.vercel.app/api/health"
    
else
    echo "📝 手动配置步骤："
    echo ""
    echo "1. 访问: https://vercel.com/dashboard"
    echo "2. 找到项目: wechat-official-account-ai-workflow-ivory"
    echo "3. 点击 Settings > Environment Variables"
    echo "4. 添加上述环境变量"
    echo "5. 选择 Production 环境"
    echo "6. 点击 Save"
    echo "7. 重新部署项目"
    echo ""
    echo "或者使用以下命令："
    echo "vercel env add AZURE_OPENAI_BASE_URL production"
    echo "vercel env add AZURE_OPENAI_API_VERSION production"
    echo "vercel env add AZURE_OPENAI_API_KEY production"
    echo "vercel env add AZURE_OPENAI_MODEL_NAME production"
    echo "vercel env add AZURE_OPENAI_MAX_TOKENS production"
    echo "vercel --prod"
fi

echo ""
echo "🔍 测试命令："
echo "curl -X POST 'https://wechat-official-account-ai-workflow-ivory.vercel.app/api/format' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"article\":\"测试文章\"}'"