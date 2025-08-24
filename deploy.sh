#!/bin/bash

# 微信公众号AI助手部署脚本
echo "🚀 开始部署微信公众号AI助手到微信云托管..."

# 检查必要文件
echo "📋 检查项目文件..."
if [ ! -f "package.json" ]; then
    echo "❌ 错误：找不到 package.json 文件"
    exit 1
fi

if [ ! -f "Dockerfile" ]; then
    echo "❌ 错误：找不到 Dockerfile 文件"
    exit 1
fi

echo "✅ 项目文件检查完成"

# 创建部署包
echo "📦 创建部署包..."
DEPLOY_DIR="deploy-package"
rm -rf $DEPLOY_DIR
mkdir $DEPLOY_DIR

# 复制必要文件
cp -r src $DEPLOY_DIR/
cp -r public $DEPLOY_DIR/ 2>/dev/null || mkdir $DEPLOY_DIR/public
cp package*.json $DEPLOY_DIR/
cp next.config.js $DEPLOY_DIR/
cp tailwind.config.js $DEPLOY_DIR/
cp postcss.config.js $DEPLOY_DIR/
cp tsconfig.json $DEPLOY_DIR/
cp Dockerfile $DEPLOY_DIR/
cp .dockerignore $DEPLOY_DIR/
cp cloudbase.json $DEPLOY_DIR/

# 创建环境变量示例文件
echo "🔧 创建环境变量示例文件..."
cat > $DEPLOY_DIR/env.example << EOF
# Azure OpenAI 配置
AZURE_OPENAI_BASE_URL=https://gpt-i18n.byteintl.net/gpt/openapi/online/v2/crawl/openai/deployments/gpt_openapi
AZURE_OPENAI_API_VERSION=2024-03-01-preview
AZURE_OPENAI_API_KEY=I2brwSdmty3dYeCtPIderK1lJzrIHYcc_GPT_AK
AZURE_OPENAI_MODEL_NAME=gemini-2.5-pro
AZURE_OPENAI_MAX_TOKENS=32000

# 微信公众号配置
WECHAT_APP_ID=wxc66e3754c009becc
WECHAT_APP_SECRET=您的开发者密码
EOF

# 创建部署说明
echo "📝 创建部署说明..."
cat > $DEPLOY_DIR/DEPLOY_README.md << EOF
# 部署说明

## 快速部署步骤

1. 登录微信云托管：https://cloud.weixin.qq.com/
2. 选择"Express.js"模板
3. 上传此文件夹内容
4. 配置环境变量（参考 env.example）
5. 设置端口为 3000
6. 部署服务

## 环境变量配置

请在微信云托管控制台配置以下环境变量：

\`\`\`bash
$(cat env.example)
\`\`\`

## 注意事项

- 确保微信公众号的开发者密码正确配置
- 配置IP白名单（微信云托管IP）
- 部署完成后测试所有功能
EOF

# 创建ZIP包
echo "🗜️ 创建ZIP部署包..."
cd $DEPLOY_DIR
zip -r ../wechat-ai-workflow-deploy.zip . -x "*.DS_Store" "*.log"
cd ..

echo "✅ 部署包创建完成：wechat-ai-workflow-deploy.zip"
echo ""
echo "📋 下一步操作："
echo "1. 登录微信云托管：https://cloud.weixin.qq.com/"
echo "2. 选择 'Express.js' 模板"
echo "3. 上传 wechat-ai-workflow-deploy.zip 文件"
echo "4. 配置环境变量（参考 deploy-package/env.example）"
echo "5. 设置端口为 3000"
echo "6. 点击部署"
echo ""
echo "📖 详细部署指南请参考：DEPLOYMENT.md"
echo "🔧 微信公众号配置请参考：WECHAT_SETUP.md" 