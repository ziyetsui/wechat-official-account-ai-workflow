#!/bin/bash

# Vercel 500错误快速修复脚本
# 使用方法: ./fix-vercel-500.sh

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_message() {
    echo -e "${2}${1}${NC}"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 未安装，请先安装 $1"
        exit 1
    fi
}

# 检查Node.js和npm
check_dependencies() {
    print_header "检查依赖项"
    
    check_command "node"
    check_command "npm"
    check_command "vercel"
    
    print_success "所有依赖项已安装"
}

# 检查环境变量
check_env_vars() {
    print_header "检查环境变量"
    
    local env_file=".env.local"
    if [ -f "$env_file" ]; then
        print_success "找到本地环境变量文件: $env_file"
        echo "本地环境变量:"
        cat "$env_file" | grep -E "AZURE_OPENAI_" || print_warning "未找到Azure OpenAI相关环境变量"
    else
        print_warning "未找到本地环境变量文件"
    fi
    
    echo ""
    print_warning "请确保在Vercel控制台中配置了以下环境变量:"
    echo "  - AZURE_OPENAI_BASE_URL"
    echo "  - AZURE_OPENAI_API_VERSION"
    echo "  - AZURE_OPENAI_API_KEY"
    echo "  - AZURE_OPENAI_MODEL_NAME"
}

# 清理构建缓存
clean_build_cache() {
    print_header "清理构建缓存"
    
    if [ -d ".next" ]; then
        rm -rf .next
        print_success "已删除 .next 目录"
    fi
    
    if [ -d "node_modules" ]; then
        print_warning "删除 node_modules 目录..."
        rm -rf node_modules
        print_success "已删除 node_modules 目录"
    fi
    
    if [ -f "package-lock.json" ]; then
        rm package-lock.json
        print_success "已删除 package-lock.json"
    fi
}

# 重新安装依赖
reinstall_dependencies() {
    print_header "重新安装依赖"
    
    print_warning "正在安装依赖项..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "依赖项安装成功"
    else
        print_error "依赖项安装失败"
        exit 1
    fi
}

# 本地构建测试
test_local_build() {
    print_header "本地构建测试"
    
    print_warning "正在执行本地构建..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "本地构建成功"
    else
        print_error "本地构建失败，请检查代码错误"
        exit 1
    fi
}

# 部署到Vercel
deploy_to_vercel() {
    print_header "部署到Vercel"
    
    print_warning "正在部署到Vercel..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        print_success "部署成功"
    else
        print_error "部署失败"
        exit 1
    fi
}

# 运行诊断工具
run_diagnostics() {
    print_header "运行诊断工具"
    
    if [ -f "check-vercel-deployment.js" ]; then
        print_warning "正在运行诊断工具..."
        node check-vercel-deployment.js
    else
        print_warning "诊断工具不存在，跳过诊断"
    fi
}

# 显示修复建议
show_fix_suggestions() {
    print_header "修复建议"
    
    echo "如果仍然遇到500错误，请尝试以下步骤:"
    echo ""
    echo "1. 检查Vercel环境变量配置:"
    echo "   - 访问 https://vercel.com/dashboard"
    echo "   - 找到你的项目"
    echo "   - 点击 Settings > Environment Variables"
    echo "   - 确保所有必需的环境变量都已配置"
    echo ""
    echo "2. 查看Vercel函数日志:"
    echo "   - 在Vercel控制台查看Functions日志"
    echo "   - 使用命令: vercel logs"
    echo ""
    echo "3. 检查API密钥和端点:"
    echo "   - 确认Azure OpenAI API密钥有效"
    echo "   - 确认API端点可访问"
    echo ""
    echo "4. 检查代码中的硬编码值:"
    echo "   - 确保没有硬编码的API密钥"
    echo "   - 使用环境变量替代硬编码值"
    echo ""
    echo "5. 检查超时设置:"
    echo "   - Vercel免费版函数有10秒超时限制"
    echo "   - 考虑升级到Pro版本或优化代码"
}

# 主函数
main() {
    print_header "Vercel 500错误修复工具"
    
    check_dependencies
    check_env_vars
    
    echo ""
    read -p "是否继续执行修复步骤? (y/N): " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "用户取消操作"
        exit 0
    fi
    
    clean_build_cache
    reinstall_dependencies
    test_local_build
    
    echo ""
    read -p "是否部署到Vercel? (y/N): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        deploy_to_vercel
        run_diagnostics
    else
        print_warning "跳过部署步骤"
    fi
    
    show_fix_suggestions
    
    print_header "修复完成"
    print_success "请检查上述建议并测试你的应用"
}

# 运行主函数
main "$@"

