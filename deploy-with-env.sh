#!/bin/bash

echo "🚀 开始部署到 Vercel..."
echo "=================================================="

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 检查git状态
echo "📋 检查Git状态..."
git status

# 添加所有更改
echo "📝 添加所有更改到Git..."
git add .

# 提交更改
echo "💾 提交更改..."
git commit -m "feat: 添加自定义排版模板和环境变量配置

- 添加徐子叶公众号自定义排版模板
- 配置ChatAI API环境变量
- 优化format API，支持自定义模板
- 更新generate API使用环境变量"

# 推送到远程仓库
echo "📤 推送到远程仓库..."
git push origin main

echo ""
echo "✅ 部署完成！"
echo ""
echo "📋 接下来需要手动配置Vercel环境变量："
echo "1. 访问 https://vercel.com/dashboard"
echo "2. 选择项目：wechat-official-account-ai-workflow"
echo "3. 进入 Settings → Environment Variables"
echo "4. 添加以下环境变量："
echo ""
echo "   CHATA_API_KEY = sk-2dFvkITb1mr3yG7FdIYkc62mZPZKMSIsvdU0dLKaiyduuO3B"
echo "   CHATA_BASE_URL = https://www.chataiapi.com/v1"
echo "   CHATA_MODEL_NAME = gpt-3.5-turbo"
echo ""
echo "5. 确保所有环境（Production, Preview, Development）都配置了这些变量"
echo "6. 重新部署项目"
echo ""
echo "🌐 网站地址：https://wechat-official-account-ai-workflow-ivory.vercel.app/"
echo ""
echo "🧪 测试命令："
echo "curl -X POST \"https://wechat-official-account-ai-workflow-ivory.vercel.app/api/generate\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"topic\": \"人工智能\", \"type\": \"content\"}'"
echo ""
echo "curl -X POST \"https://wechat-official-account-ai-workflow-ivory.vercel.app/api/format\" \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"article\": \"这是一篇测试文章\"}'"
