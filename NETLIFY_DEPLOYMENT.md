# Netlify部署指南

本指南将帮助您将微信公众号AI助手部署到Netlify平台，获得完整的服务端功能支持。

## 🚀 Netlify优势

- ✅ **完整的Next.js支持**：支持所有Next.js功能，包括API路由
- ✅ **自动HTTPS**：免费SSL证书
- ✅ **全球CDN**：快速访问
- ✅ **自动部署**：Git集成，推送即部署
- ✅ **环境变量**：支持服务端环境变量
- ✅ **函数计算**：支持服务端函数
- ✅ **免费计划**：每月100GB带宽，125,000次函数调用

## 📋 部署步骤

### 方法一：使用部署脚本（推荐）

1. **运行部署脚本**：
```bash
./deploy-to-netlify.sh
```

2. **按提示操作**：
   - 首次使用需要登录Netlify
   - 选择项目设置
   - 等待部署完成

### 方法二：手动部署

1. **安装Netlify CLI**：
```bash
npm install -g netlify-cli
```

2. **登录Netlify**：
```bash
netlify login
```

3. **构建项目**：
```bash
npm run build
```

4. **部署项目**：
```bash
netlify deploy --prod --dir=.next
```

### 方法三：GitHub集成（推荐）

1. **访问Netlify控制台**：https://app.netlify.com/
2. **点击"New site from Git"**
3. **选择GitHub**：授权并选择仓库 `ziyetsui/wechat-official-account-ai-workflow`
4. **配置构建设置**：
   - Build command: `npm run build`
   - Publish directory: `.next`
5. **点击"Deploy site"**

## ⚙️ 环境变量配置

在Netlify控制台中配置以下环境变量：

### 必需的环境变量

```env
# Azure OpenAI API配置
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
AZURE_OPENAI_API_VERSION=2024-03-01-preview
AZURE_OPENAI_MODEL_NAME=gemini-2.5-pro
AZURE_OPENAI_MAX_TOKENS=32000
```

### 可选的环境变量

```env
# 微信公众号API配置（用于发布功能）
WECHAT_APP_ID=your_wechat_app_id
WECHAT_APP_SECRET=your_wechat_app_secret
```

### 配置步骤

1. 在Netlify控制台进入项目
2. 点击 **Site settings**
3. 在左侧菜单找到 **Environment variables**
4. 添加上述环境变量
5. 选择环境（Production, Deploy preview, Branch deploy）
6. 点击 **Save**

## 🔧 项目配置

### netlify.toml配置

项目已包含优化的Netlify配置：

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  directory = "netlify/functions"

[[headers]]
  for = "/api/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Methods = "GET, POST, PUT, DELETE, OPTIONS"
    Access-Control-Allow-Headers = "Content-Type, Authorization"
```

### 功能说明

- **API路由支持**：完整的服务端API功能
- **函数超时**：API函数最长10秒执行时间
- **自动路由**：API路由自动配置
- **CORS支持**：跨域请求支持

## 🌐 域名配置

### 默认域名

部署完成后，您将获得一个默认域名：
```
https://your-project-name.netlify.app
```

### 自定义域名

1. 在Netlify控制台进入项目
2. 点击 **Site settings** > **Domain management**
3. 点击 **Add custom domain**
4. 输入您的域名
5. 配置DNS记录
6. 等待DNS生效

## 📊 监控和分析

### 访问分析

- **Analytics**：页面访问统计
- **Functions**：API函数调用统计
- **Logs**：实时日志查看

### 性能监控

- **Core Web Vitals**：页面性能指标
- **Function Duration**：函数执行时间
- **Error Tracking**：错误监控

## 🔄 自动部署

### Git集成

1. 连接GitHub仓库
2. 配置分支部署规则
3. 推送代码自动部署

### 部署规则

- **main分支**：自动部署到Production
- **其他分支**：自动部署到Deploy preview
- **Pull Request**：自动部署到Deploy preview

## 🛠️ 故障排除

### 常见问题

1. **构建失败**
   - 检查环境变量配置
   - 查看构建日志
   - 确认依赖安装

2. **API函数超时**
   - 检查函数执行时间
   - 优化代码逻辑
   - 增加超时时间

3. **环境变量未生效**
   - 确认环境变量名称正确
   - 检查环境选择
   - 重新部署项目

### 调试技巧

1. **查看日志**：
```bash
netlify logs
```

2. **本地测试**：
```bash
netlify dev
```

3. **检查配置**：
```bash
netlify status
```

## 📞 支持

- **Netlify文档**：https://docs.netlify.com/
- **Next.js文档**：https://nextjs.org/docs
- **社区支持**：https://community.netlify.com/

## 🎉 部署完成

部署成功后，您将获得：

- ✅ 完整的服务端功能
- ✅ 自动HTTPS和CDN
- ✅ 环境变量支持
- ✅ 自动部署
- ✅ 性能监控
- ✅ 错误追踪

您的微信公众号AI助手现在拥有完整的服务端功能！🚀
