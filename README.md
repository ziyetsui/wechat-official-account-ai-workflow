# 微信公众号AI助手

一个基于AI技术的微信公众号内容创作和管理工具，采用Notion风格设计，帮助提升内容创作效率。

## ✨ 功能特色

- 🤖 **AI内容生成**: 基于Azure OpenAI API智能生成高质量文章
- 🎨 **Notion风格UI**: 简洁现代的卡片式设计，优雅的交互体验
- 📝 **智能排版**: 自动转换为公众号兼容的HTML格式
- 🚀 **一键发布**: 支持预览和直接发布到微信公众号
- 🖼️ **配图建议**: 为文章推荐合适的配图方案
- 📱 **响应式设计**: 适配各种设备屏幕
- 🌙 **深色模式**: 支持明暗主题切换

## 🛠️ 技术栈

- **前端框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + 自定义Notion风格组件
- **图标**: Lucide React
- **AI集成**: Azure OpenAI API
- **部署**: Vercel / GitHub Pages / Netlify

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 环境配置

创建 `.env.local` 文件并配置以下环境变量：

```bash
# Azure OpenAI 配置
AZURE_OPENAI_BASE_URL=https://gpt-i18n.byteintl.net/gpt/openapi/online/v2/crawl/openai/deployments/gpt_openapi
AZURE_OPENAI_API_VERSION=2024-03-01-preview
AZURE_OPENAI_API_KEY=I2brwSdmty3dYeCtPIderK1lJzrIHYcc_GPT_AK
AZURE_OPENAI_MODEL_NAME=gemini-2.5-pro
AZURE_OPENAI_MAX_TOKENS=32000

# 微信公众号配置（用于发布功能）
WECHAT_APP_ID=wxc66e3754c009becc
WECHAT_APP_SECRET=您的开发者密码
```

**注意**：微信公众号配置需要：
1. 在微信公众平台获取开发者密码
2. 配置IP白名单
3. 详细配置步骤请参考 [WECHAT_SETUP.md](./WECHAT_SETUP.md)

### 开发模式

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 🌐 部署选项

### 1. Vercel 部署（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

**优势**：
- 支持完整的服务端功能
- 自动HTTPS
- 全球CDN
- 零配置部署

### 2. GitHub Pages 部署

```bash
# 使用快速部署脚本
./deploy-to-github.sh
```

**优势**：
- 免费托管
- 自动构建
- 版本控制集成

### 3. Netlify 部署

```bash
# 构建项目
npm run build

# 部署到 Netlify
# 将 out/ 目录拖拽到 Netlify 部署区域
```

**优势**：
- 免费计划
- 自动构建
- 表单处理

详细部署指南请参考：[GITHUB_DEPLOYMENT.md](./GITHUB_DEPLOYMENT.md)

## 🎨 Notion风格设计

### 设计特点

- **简洁的视觉风格**: 纯净的白色/灰色背景，无渐变干扰
- **卡片式布局**: 优雅的圆角和微妙阴影
- **现代化交互**: 悬停效果和流畅动画
- **统一组件系统**: 可复用的Notion风格组件

### 组件系统

```css
/* 卡片组件 */
.notion-card          /* 基础卡片 */
.notion-card-hover    /* 悬停效果 */

/* 按钮组件 */
.notion-button        /* 基础按钮 */
.notion-button-primary /* 主要按钮 */
.notion-button-secondary /* 次要按钮 */

/* 输入组件 */
.notion-input         /* 输入框 */
.notion-textarea      /* 文本域 */

/* 标签页 */
.notion-tab           /* 标签页 */
.notion-tab-active    /* 激活状态 */
.notion-tab-inactive  /* 非激活状态 */

/* 徽章 */
.notion-badge         /* 基础徽章 */
.notion-badge-blue    /* 蓝色徽章 */
.notion-badge-green   /* 绿色徽章 */
.notion-badge-purple  /* 紫色徽章 */
```

## 📁 项目结构

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API路由
│   │   ├── generate/   # 内容生成API
│   │   ├── format/     # 排版API
│   │   └── publish/    # 发布API
│   ├── format/         # 排版页面
│   ├── globals.css     # 全局样式（Notion风格）
│   ├── layout.tsx      # 根布局
│   └── page.tsx        # 主页面
├── components/         # React组件
│   ├── AdvancedSettings.tsx  # 高级设置组件
│   └── ExportButton.tsx      # 导出按钮组件
└── lib/               # 工具函数和配置
    ├── openai.ts      # OpenAI API配置
    ├── prompts.ts     # 提示词模板
    ├── format-prompts.ts # 排版提示词
    └── wechat-api.ts  # 微信API
```

## 🔧 开发工具

### 部署检查

```bash
# 检查部署配置
node check-deployment.js

# 自动修复部署问题
./fix-deployment.sh

# 快速部署到GitHub
./deploy-to-github.sh
```

### 构建部署包

```bash
# 创建微信云托管部署包
./deploy.sh
```

## 📋 功能清单

- ✅ **AI内容生成**: 基于Azure OpenAI API智能生成高质量文章
- ✅ **标题建议**: 自动生成多个吸引人的文章标题
- ✅ **配图建议**: 为文章推荐合适的配图方案
- ✅ **HTML排版**: 自动转换为公众号兼容的HTML格式
- ✅ **一键发布**: 支持预览和直接发布到微信公众号
- ✅ **Notion风格UI**: 简洁现代的卡片式设计
- ✅ **响应式设计**: 适配各种设备屏幕
- ✅ **深色模式**: 支持明暗主题切换
- ✅ **高级设置**: 自定义内容生成参数
- ✅ **导出功能**: 支持JSON和文本格式导出

## 🚧 开发计划

- [ ] 添加文章模板功能
- [ ] 实现图片生成功能
- [ ] 添加文章编辑和预览功能
- [ ] 支持多种内容类型（图文、视频等）
- [ ] 添加用户认证和内容管理
- [ ] 历史记录和收藏功能
- [ ] 更多Notion风格组件
- [ ] 主题自定义功能

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目。

### 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

MIT License

## 📞 支持

如果您遇到问题或有建议，请：

1. 查看 [GITHUB_DEPLOYMENT.md](./GITHUB_DEPLOYMENT.md) 部署指南
2. 查看 [WECHAT_SETUP.md](./WECHAT_SETUP.md) 微信配置指南
3. 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 微信云托管部署指南
4. 提交 [Issue](https://github.com/your-username/wechat-official-account-ai-workflow/issues)

---

**⭐ 如果这个项目对您有帮助，请给它一个星标！** 