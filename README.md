# 微信公众号AI助手

一个基于AI技术的微信公众号内容创作工具，帮助您快速生成高质量的文章内容并进行专业排版。

## ✨ 功能特性

### 🤖 AI内容生成
- **智能文章生成**：基于主题自动生成高质量文章内容
- **标题建议**：AI推荐多个吸引人的标题选项
- **配图建议**：为文章推荐合适的配图方案
- **多种写作风格**：支持刘润、罗振宇、吴晓波等多种写作风格

### 🎨 专业排版
- **自动排版**：将原始文章转换为公众号专用HTML格式
- **样式规范**：严格按照公众号排版规范应用样式
- **智能优化**：自动添加分割线、强调样式、章节编号

### 📱 一键发布
- **预览功能**：支持发送预览到指定用户
- **直接发布**：一键发布到微信公众号
- **批量操作**：支持批量处理多篇文章

### ⚙️ 高级设置
- **目标受众**：自定义内容的目标读者群体
- **内容长度**：灵活控制文章字数
- **写作风格**：选择不同的写作风格和语调
- **内容元素**：控制是否包含案例、故事等元素

## 🚀 快速开始

### 环境要求
- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/YOUR_USERNAME/wechat-official-account-ai-workflow.git
cd wechat-official-account-ai-workflow
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，添加您的API密钥：
```env
# Azure OpenAI API配置
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
AZURE_OPENAI_API_VERSION=2024-03-01-preview
AZURE_OPENAI_MODEL_NAME=gemini-2.5-pro

# 微信公众号API配置（可选）
WECHAT_APP_ID=your_wechat_app_id
WECHAT_APP_SECRET=your_wechat_app_secret
```

4. **启动开发服务器**
```bash
npm run dev
```

5. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📖 使用指南

### 生成文章内容
1. 在主页输入文章主题或关键词
2. 调整高级设置（可选）
3. 点击"生成内容"按钮
4. 查看生成的文章内容、标题建议和配图建议

### 文章排版
1. 访问"文章排版工具"页面
2. 粘贴原始文章内容
3. 点击"自动排版"按钮
4. 复制或下载排版后的HTML内容

### 发布到公众号
1. 在排版页面点击"发布到公众号"
2. 填写文章标题、作者等信息
3. 选择"发送预览"或"发布文章"
4. 确认发布

## 🛠️ 技术栈

- **前端框架**：Next.js 14 (App Router)
- **开发语言**：TypeScript
- **样式框架**：Tailwind CSS
- **UI组件**：Lucide React Icons
- **AI服务**：Azure OpenAI API
- **部署平台**：支持Vercel、Netlify、微信云托管等

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router页面
│   ├── api/               # API路由
│   │   ├── generate/      # 内容生成API
│   │   ├── format/        # 排版API
│   │   └── publish/       # 发布API
│   ├── format/            # 排版工具页面
│   └── page.tsx           # 主页面
├── components/            # React组件
│   ├── AdvancedSettings.tsx
│   └── ExportButton.tsx
└── lib/                   # 工具库
    ├── openai.ts          # OpenAI API客户端
    ├── prompts.ts         # 提示词模板
    ├── format-prompts.ts  # 排版提示词
    └── wechat-api.ts      # 微信API客户端
```

## 🔧 配置说明

### Azure OpenAI API配置
1. 登录Azure门户
2. 创建OpenAI服务实例
3. 获取API密钥和端点URL
4. 在环境变量中配置相关信息

### 微信公众号配置
1. 登录微信公众平台
2. 获取AppID和AppSecret
3. 配置IP白名单（如需要）
4. 在环境变量中配置相关信息

详细配置说明请参考 [WECHAT_SETUP.md](./WECHAT_SETUP.md)

## 🚀 部署

### Vercel部署（推荐）
1. Fork本项目到您的GitHub账户
2. 在Vercel中导入项目
3. 配置环境变量
4. 部署完成

### 微信云托管部署
1. 准备部署包：`npm run deploy`
2. 上传到微信云托管
3. 配置环境变量
4. 启动服务

详细部署说明请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

### 开发流程
1. Fork项目
2. 创建功能分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -am 'Add some feature'`
4. 推送分支：`git push origin feature/your-feature`
5. 提交Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Lucide React](https://lucide.dev/) - 图标库
- [Azure OpenAI](https://azure.microsoft.com/en-us/products/cognitive-services/openai-service) - AI服务

## 📞 支持

如果您在使用过程中遇到问题，请：

1. 查看 [Issues](../../issues) 页面
2. 创建新的Issue描述问题
3. 联系开发者获取支持

---

⭐ 如果这个项目对您有帮助，请给它一个星标！ 