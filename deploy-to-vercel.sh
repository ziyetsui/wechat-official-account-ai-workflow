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

# 检查是否已登录Vercel
print_step "检查Vercel登录状态..."
if ! vercel whoami &> /dev/null; then
    print_message "请先登录Vercel..."
    vercel login
fi

# 部署到Vercel
print_step "部署到Vercel..."
vercel --prod

print_message "✅ Vercel部署完成！"
echo ""
print_message "🎉 您的项目已成功部署到Vercel！"
echo ""
print_message "📋 下一步操作："
echo "1. 在Vercel控制台配置环境变量"
echo "2. 设置自定义域名（可选）"
echo "3. 配置自动部署"
echo ""
print_warning "注意：请确保在Vercel控制台中配置以下环境变量："
echo "- AZURE_OPENAI_API_KEY"
echo "- AZURE_OPENAI_ENDPOINT"
echo "- AZURE_OPENAI_API_VERSION"
echo "- AZURE_OPENAI_MODEL_NAME"
echo "- WECHAT_APP_ID（可选）"
echo "- WECHAT_APP_SECRET（可选）"
