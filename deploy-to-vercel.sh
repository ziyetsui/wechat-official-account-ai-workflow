#!/bin/bash

# Vercel部署脚本
# 使用方法: ./deploy-to-vercel.sh

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_step "开始部署到Vercel..."

# 检查是否已安装Vercel CLI
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI 未安装，正在安装..."
    npm install -g vercel
fi

# 检查当前目录是否为git仓库
if [ ! -d ".git" ]; then
    print_error "当前目录不是git仓库"
    exit 1
fi

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    print_warning "检测到未提交的更改，正在提交..."
    git add .
    git commit -m "feat: 准备部署到Vercel"
fi

# 创建vercel.json配置文件
print_step "创建Vercel配置文件..."

cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/\$1"
    }
  ],
  "env": {
    "OPENAI_API_KEY": "@openai_api_key",
    "WECHAT_APP_ID": "@wechat_app_id",
    "WECHAT_APP_SECRET": "@wechat_app_secret"
  }
}
EOF

print_message "vercel.json配置文件已创建"

# 提交配置文件
git add vercel.json
git commit -m "feat: 添加Vercel配置文件"

# 部署到Vercel
print_step "部署到Vercel..."
vercel --prod

print_message "✅ 部署完成！"
echo ""
print_message "🎉 您的项目已成功部署到Vercel！"
echo ""
print_message "📋 下一步操作："
echo "1. 在Vercel控制台中设置环境变量："
echo "   - OPENAI_API_KEY"
echo "   - WECHAT_APP_ID"
echo "   - WECHAT_APP_SECRET"
echo "2. 重新部署以应用环境变量"
echo ""
print_message "🌐 您的网站地址："
echo "请查看Vercel控制台获取部署URL"
echo ""
print_warning "注意：请确保在Vercel控制台中正确设置所有环境变量。"
