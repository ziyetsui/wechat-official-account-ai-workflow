# GitHub 部署指南

## 🚀 快速部署

### 1. 创建 GitHub 仓库

1. 登录 GitHub
2. 点击右上角的 "+" 号，选择 "New repository"
3. 仓库名称：`wechat-official-account-ai-workflow`
4. 描述：`AI-powered WeChat official account content creation and management tool`
5. 选择 "Public" 或 "Private"
6. 不要勾选 "Add a README file"（我们已经有文件了）
7. 点击 "Create repository"

### 2. 推送代码到 GitHub

```bash
# 添加所有文件到 Git
git add .

# 提交更改
git commit -m "Initial commit: Notion-style WeChat AI workflow"

# 添加远程仓库（替换 YOUR_USERNAME 为您的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/wechat-official-account-ai-workflow.git

# 推送到主分支
git branch -M main
git push -u origin main
```

### 3. 配置环境变量

由于我们的应用使用了API密钥，需要在GitHub仓库中配置环境变量：

1. 进入您的GitHub仓库
2. 点击 "Settings" 标签
3. 在左侧菜单中点击 "Secrets and variables" → "Actions"
4. 点击 "New repository secret" 添加以下密钥：

#### 必需的密钥：
- `AZURE_OPENAI_BASE_URL`: `https://gpt-i18n.byteintl.net/gpt/openapi/online/v2/crawl/openai/deployments/gpt_openapi`
- `AZURE_OPENAI_API_KEY`: `I2brwSdmty3dYeCtPIderK1lJzrIHYcc_GPT_AK`
- `AZURE_OPENAI_MODEL_NAME`: `gemini-2.5-pro`

#### 可选的密钥（用于微信公众号功能）：
- `WECHAT_APP_ID`: `wxc66e3754c009becc`
- `WECHAT_APP_SECRET`: 您的开发者密码

### 4. 部署选项

#### 选项 A：Vercel 部署（推荐）

1. 访问 [Vercel](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "New Project"
4. 导入您的 GitHub 仓库
5. 配置环境变量（与 GitHub Secrets 相同）
6. 点击 "Deploy"

#### 选项 B：GitHub Pages 部署

1. 在 GitHub 仓库中，进入 "Settings" → "Pages"
2. Source 选择 "GitHub Actions"
3. 推送代码后，GitHub Actions 会自动构建和部署

#### 选项 C：Netlify 部署

1. 访问 [Netlify](https://netlify.com)
2. 使用 GitHub 账号登录
3. 点击 "New site from Git"
4. 选择您的 GitHub 仓库
5. 配置环境变量
6. 点击 "Deploy site"

## 🔧 部署配置

### GitHub Actions 工作流

项目包含两个工作流文件：

1. **`.github/workflows/deploy.yml`** - Vercel 部署
2. **`.github/workflows/github-pages.yml`** - GitHub Pages 部署

### 静态导出配置

`next.config.js` 已配置为支持静态导出：

```javascript
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}
```

## 📝 注意事项

### 1. API 限制

由于静态导出的限制，以下功能在部署后可能无法正常工作：
- 文章生成 API
- 排版 API
- 发布到公众号 API

**解决方案：**
- 使用 Vercel 部署（支持服务端功能）
- 或者将 API 部署到单独的服务

### 2. 环境变量

确保在部署平台中正确配置所有环境变量。

### 3. 域名配置

部署完成后，您会获得一个域名：
- Vercel: `https://your-project.vercel.app`
- GitHub Pages: `https://your-username.github.io/wechat-official-account-ai-workflow`
- Netlify: `https://your-project.netlify.app`

## 🎯 推荐部署方案

### 开发环境
- 本地开发：`npm run dev`
- 测试构建：`npm run build`

### 生产环境
1. **Vercel**（推荐）- 支持完整的服务端功能
2. **Netlify** - 良好的静态站点托管
3. **GitHub Pages** - 免费但功能有限

## 🔄 更新部署

每次推送代码到 `main` 分支时，GitHub Actions 会自动触发新的部署。

```bash
# 推送更新
git add .
git commit -m "Update: 描述您的更改"
git push origin main
```

## 📞 支持

如果遇到部署问题，请检查：
1. GitHub Actions 日志
2. 环境变量配置
3. 构建错误信息

---

**注意：** 请确保不要将敏感信息（如API密钥）直接提交到代码中，始终使用环境变量。 