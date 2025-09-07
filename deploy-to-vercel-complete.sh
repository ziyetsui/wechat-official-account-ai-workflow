#!/bin/bash

echo "🚀 完整的 Vercel 部署和配置脚本"
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
echo "1. GEMINI_API_KEY"
echo "   值: AIzaSyAjVdNMbHndiBgWv-dvDPIcsJ2OQFDu6ug"
echo ""
echo "2. GEMINI_BASE_URL"
echo "   值: https://api.246520.xyz"
echo ""
echo "3. GEMINI_MODEL_NAME"
echo "   值: gemini-2.5-pro"
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
    echo "设置 GEMINI_API_KEY..."
    vercel env add GEMINI_API_KEY production <<< "AIzaSyAjVdNMbHndiBgWv-dvDPIcsJ2OQFDu6ug"
    
    echo "设置 GEMINI_BASE_URL..."
    vercel env add GEMINI_BASE_URL production <<< "https://api.246520.xyz"
    
    echo "设置 GEMINI_MODEL_NAME..."
    vercel env add GEMINI_MODEL_NAME production <<< "gemini-2.5-pro"
    
    echo ""
    echo "✅ 环境变量配置完成！"
    echo ""
    echo "🔄 正在重新部署项目..."
    vercel --prod
    
    echo ""
    echo "🎉 部署完成！"
    echo "网站地址: https://wechat-official-account-ai-workflow-ivory.vercel.app"
    echo "健康检查: https://wechat-official-account-ai-workflow-ivory.vercel.app/api/health"
    echo "排版工具: https://wechat-official-account-ai-workflow-ivory.vercel.app/format"
    
else
    echo "📝 手动配置步骤："
    echo ""
    echo "1. 访问: https://vercel.com/dashboard"
    echo "2. 找到项目: wechat-official-account-ai-workflow-ivory"
    echo "3. 点击 Settings > Environment Variables"
    echo "4. 添加以下环境变量："
    echo ""
    echo "   GEMINI_API_KEY = AIzaSyAjVdNMbHndiBgWv-dvDPIcsJ2OQFDu6ug"
    echo "   GEMINI_BASE_URL = https://api.246520.xyz"
    echo "   GEMINI_MODEL_NAME = gemini-2.5-pro"
    echo ""
    echo "5. 选择 Production 环境"
    echo "6. 点击 Save"
    echo "7. 重新部署项目"
    echo ""
    echo "或者使用以下命令："
    echo "vercel env add GEMINI_API_KEY production"
    echo "vercel env add GEMINI_BASE_URL production"
    echo "vercel env add GEMINI_MODEL_NAME production"
    echo "vercel --prod"
fi

echo ""
echo "🔍 测试命令："
echo "curl -X POST 'https://wechat-official-account-ai-workflow-ivory.vercel.app/api/format' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"article\":\"测试文章\"}'"
echo ""
echo "📊 功能测试："
echo "1. 主页面: https://wechat-official-account-ai-workflow-ivory.vercel.app/"
echo "2. 排版工具: https://wechat-official-account-ai-workflow-ivory.vercel.app/format"
echo "3. 健康检查: https://wechat-official-account-ai-workflow-ivory.vercel.app/api/health"
