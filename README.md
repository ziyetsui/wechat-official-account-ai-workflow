# 微信公众号AI助手

一个基于AI技术的微信公众号内容创作和管理工具，帮助提升内容创作效率。

## 功能特色

- 🤖 **AI内容生成**: 基于主题智能生成高质量的文章内容
- 🖼️ **配图建议**: 为文章推荐合适的配图，增强视觉效果
- ⚡ **智能优化**: 自动优化文章结构、标题和关键词
- 🎨 **现代化UI**: 美观的用户界面，支持深色模式
- 📱 **响应式设计**: 适配各种设备屏幕

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **AI集成**: OpenAI API (计划中)

## 快速开始

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

## 项目结构

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # 全局样式
│   ├── layout.tsx      # 根布局
│   └── page.tsx        # 主页面
├── components/         # React组件
└── lib/               # 工具函数和配置
```

## 功能特性

- ✅ **AI内容生成**: 基于Azure OpenAI API智能生成高质量文章
- ✅ **标题建议**: 自动生成多个吸引人的文章标题
- ✅ **配图建议**: 为文章推荐合适的配图方案
- ✅ **HTML排版**: 自动转换为公众号兼容的HTML格式
- ✅ **一键发布**: 支持预览和直接发布到微信公众号
- ✅ **现代化UI**: 美观的用户界面，支持深色模式
- ✅ **响应式设计**: 适配各种设备屏幕

## 开发计划

- [ ] 添加文章模板功能
- [ ] 实现图片生成功能
- [ ] 添加文章编辑和预览功能
- [ ] 支持多种内容类型（图文、视频等）
- [ ] 添加用户认证和内容管理
- [ ] 历史记录和收藏功能

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 许可证

MIT License 