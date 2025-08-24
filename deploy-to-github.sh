#!/bin/bash

# GitHub部署脚本
# 使用方法: ./deploy-to-github.sh <your-github-username>

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

# 检查参数
if [ $# -eq 0 ]; then
    print_error "请提供GitHub用户名"
    echo "使用方法: $0 <your-github-username>"
    echo "例如: $0 john-doe"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME="wechat-official-account-ai-workflow"
REPO_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

print_step "开始部署到GitHub..."

# 检查是否已安装gh CLI
if ! command -v gh &> /dev/null; then
    print_warning "GitHub CLI (gh) 未安装，将使用git命令"
    USE_GH=false
else
    print_message "检测到GitHub CLI，将使用gh命令创建仓库"
    USE_GH=true
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
    git commit -m "feat: 准备部署到GitHub"
fi

# 创建GitHub仓库
print_step "创建GitHub仓库..."

if [ "$USE_GH" = true ]; then
    # 使用GitHub CLI创建仓库
    print_message "使用GitHub CLI创建仓库..."
    gh repo create "$REPO_NAME" \
        --public \
        --description "微信公众号AI助手 - 基于AI技术的内容创作工具" \
        --homepage "https://$GITHUB_USERNAME.github.io/$REPO_NAME" \
        --source=. \
        --remote=origin \
        --push
else
    # 手动创建仓库
    print_message "请在GitHub上手动创建仓库: $REPO_URL"
    print_message "然后运行以下命令:"
    echo "git remote add origin $REPO_URL"
    echo "git push -u origin main"
    read -p "按回车键继续..."
fi

# 配置远程仓库
if [ "$USE_GH" = false ]; then
    print_step "配置远程仓库..."
    git remote add origin "$REPO_URL"
    git push -u origin main
fi

# 创建GitHub Pages配置
print_step "配置GitHub Pages..."

# 创建.github/workflows目录
mkdir -p .github/workflows

# 创建GitHub Pages工作流
cat > .github/workflows/deploy.yml << EOF
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build project
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
EOF

print_message "GitHub Pages工作流配置已创建"

# 更新package.json以支持静态导出
print_step "配置静态导出..."

# 检查package.json中是否已有export配置
if ! grep -q '"export"' package.json; then
    # 备份package.json
    cp package.json package.json.backup
    
    # 添加export脚本
    sed -i '' 's/"build": "next build"/"build": "next build",\n    "export": "next build && next export"/' package.json
    
    print_message "package.json已更新，添加了export脚本"
fi

# 更新next.config.js以支持静态导出
if [ ! -f "next.config.js" ]; then
    print_error "next.config.js文件不存在"
    exit 1
fi

# 检查是否已有output配置
if ! grep -q "output: 'export'" next.config.js; then
    # 备份next.config.js
    cp next.config.js next.config.js.backup
    
    # 添加output配置
    sed -i '' 's/};$/  output: "export",\n  trailingSlash: true,\n  images: {\n    unoptimized: true\n  }\n};/' next.config.js
    
    print_message "next.config.js已更新，添加了静态导出配置"
fi

# 提交配置更改
print_step "提交配置更改..."
git add .
git commit -m "feat: 添加GitHub Pages部署配置"

# 推送到GitHub
print_step "推送到GitHub..."
git push origin main

# 创建README中的部署说明
print_step "更新README文件..."

# 更新README中的GitHub链接
sed -i '' "s/YOUR_USERNAME/$GITHUB_USERNAME/g" README.md

git add README.md
git commit -m "docs: 更新README中的GitHub链接"
git push origin main

print_message "✅ 部署完成！"
echo ""
print_message "🎉 您的项目已成功部署到GitHub！"
echo ""
print_message "📋 下一步操作："
echo "1. 访问 https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "2. 进入 Settings > Pages"
echo "3. 选择 Source: Deploy from a branch"
echo "4. 选择 Branch: gh-pages"
echo "5. 点击 Save"
echo ""
print_message "🌐 您的网站将在几分钟后可用："
echo "https://$GITHUB_USERNAME.github.io/$REPO_NAME"
echo ""
print_warning "注意：首次部署可能需要几分钟时间，请耐心等待。"
