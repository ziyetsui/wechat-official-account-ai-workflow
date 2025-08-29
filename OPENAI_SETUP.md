# OpenAI API 配置指南

## 🚀 从 Azure OpenAI 迁移到 OpenAI API

你的项目已经从 Azure OpenAI API 迁移到标准的 OpenAI API。以下是配置步骤：

## ⚙️ 环境变量配置

### 1. 获取 OpenAI API 密钥

1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 登录或注册账户
3. 点击右上角的 "API Keys"
4. 点击 "Create new secret key"
5. 复制生成的 API 密钥

### 2. 在 Vercel 中配置环境变量

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 找到你的项目：`wechat-official-account-ai-workflow-uico`
3. 点击 **Settings** > **Environment Variables**
4. 添加以下环境变量：

```
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL_NAME=gpt-4
```

**注意：**
- 将 `sk-your-api-key-here` 替换为你的实际 API 密钥
- 模型名称可以是：`gpt-4`、`gpt-4-turbo`、`gpt-3.5-turbo` 等
- 确保选择 **Production** 环境

### 3. 本地开发环境变量

创建 `.env.local` 文件：

```bash
# .env.local
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL_NAME=gpt-4
```

## 🔧 代码变更说明

### 主要变更：

1. **API 端点变更：**
   - 从：`https://gpt-i18n.byteintl.net/gpt/openapi/online/v2/crawl/openai/deployments/gpt_openapi`
   - 到：`https://api.openai.com/v1/chat/completions`

2. **认证方式变更：**
   - 从：`api-key` 头部
   - 到：`Authorization: Bearer <api-key>` 头部

3. **环境变量变更：**
   - 从：`AZURE_OPENAI_*` 系列变量
   - 到：`OPENAI_API_KEY` 和 `OPENAI_MODEL_NAME`

### 更新的文件：

- `src/app/api/test-connection/route.ts`
- `src/app/api/generate/route.ts`
- `src/app/api/health/route.ts`
- `check-vercel-deployment.js`

## 🧪 测试配置

### 1. 本地测试

```bash
# 启动开发服务器
npm run dev

# 测试健康检查
curl http://localhost:3000/api/health

# 测试API连接
curl http://localhost:3000/api/test-connection

# 测试内容生成
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"topic":"人工智能","type":"title"}'
```

### 2. 部署测试

```bash
# 部署到Vercel
npx vercel --prod

# 运行诊断工具
node check-vercel-deployment.js
```

## 💰 成本考虑

### OpenAI API 定价（2024年）：

- **GPT-4**: $0.03 / 1K input tokens, $0.06 / 1K output tokens
- **GPT-4 Turbo**: $0.01 / 1K input tokens, $0.03 / 1K output tokens
- **GPT-3.5 Turbo**: $0.0015 / 1K input tokens, $0.002 / 1K output tokens

### 估算示例：

一篇 3000 字的文章大约需要：
- 输入：约 1000 tokens
- 输出：约 3000 tokens
- 使用 GPT-4：约 $0.21
- 使用 GPT-3.5 Turbo：约 $0.0075

## 🔒 安全注意事项

1. **API 密钥安全：**
   - 永远不要在代码中硬编码 API 密钥
   - 使用环境变量存储敏感信息
   - 定期轮换 API 密钥

2. **请求限制：**
   - 设置合理的 `max_tokens` 限制
   - 实现请求频率限制
   - 监控 API 使用量

3. **错误处理：**
   - 实现完善的错误处理机制
   - 记录 API 调用日志
   - 设置超时处理

## 🚀 部署步骤

1. **配置环境变量：**
   ```bash
   # 在Vercel控制台配置
   OPENAI_API_KEY=sk-your-api-key-here
   OPENAI_MODEL_NAME=gpt-4
   ```

2. **部署代码：**
   ```bash
   npx vercel --prod
   ```

3. **验证部署：**
   ```bash
   node check-vercel-deployment.js
   ```

4. **测试功能：**
   - 访问主页面
   - 测试内容生成
   - 检查错误日志

## 📞 故障排除

### 常见问题：

1. **401 错误：**
   - 检查 API 密钥是否正确
   - 确认环境变量已配置

2. **429 错误：**
   - API 请求频率超限
   - 等待一段时间后重试

3. **500 错误：**
   - 检查 Vercel 函数日志
   - 确认代码没有语法错误

### 获取帮助：

- [OpenAI API 文档](https://platform.openai.com/docs)
- [Vercel 文档](https://vercel.com/docs)
- 查看项目中的 `VERCEL_500_TROUBLESHOOTING.md`

---

**完成配置后，你的应用将使用标准的 OpenAI API 进行内容生成！**

