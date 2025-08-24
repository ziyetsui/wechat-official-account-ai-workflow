#!/bin/bash

echo "🚀 开始部署到 GitHub..."

# 检查是否已配置远程仓库
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ 未配置远程仓库"
    echo ""
    echo "请按以下步骤操作："
    echo ""
    echo "1. 在 GitHub 上创建新仓库："
    echo "   - 仓库名称：wechat-official-account-ai-workflow"
    echo "   - 描述：AI-powered WeChat official account content creation and management tool"
    echo "   - 选择 Public 或 Private"
    echo ""
    echo "2. 添加远程仓库："
    echo "   git remote add origin https://github.com/YOUR_USERNAME/wechat-official-account-ai-workflow.git"
    echo ""
    echo "3. 重新运行此脚本"
    echo ""
    exit 1
fi

# 显示当前远程仓库
echo "📋 当前远程仓库："
git remote -v
echo ""

# 确认推送
read -p "确认推送到 GitHub？(y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 取消推送"
    exit 1
fi

# 推送到 GitHub
echo "📤 推送到 GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 代码已成功推送到 GitHub！"
    echo ""
    echo "📋 下一步操作："
    echo ""
    echo "1. 配置环境变量："
    echo "   - 进入 GitHub 仓库"
    echo "   - Settings → Secrets and variables → Actions"
    echo "   - 添加以下密钥："
    echo "     * AZURE_OPENAI_BASE_URL"
    echo "     * AZURE_OPENAI_API_KEY"
    echo "     * AZURE_OPENAI_MODEL_NAME"
    echo "     * WECHAT_APP_ID (可选)"
    echo "     * WECHAT_APP_SECRET (可选)"
    echo ""
    echo "2. 选择部署平台："
    echo "   - Vercel (推荐): https://vercel.com"
    echo "   - Netlify: https://netlify.com"
    echo "   - GitHub Pages: 仓库 Settings → Pages"
    echo ""
    echo "3. 详细部署指南请参考：GITHUB_DEPLOYMENT.md"
    echo ""
else
    echo "❌ 推送失败，请检查网络连接和仓库权限"
    exit 1
fi 