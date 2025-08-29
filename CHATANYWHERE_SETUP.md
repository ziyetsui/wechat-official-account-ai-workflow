# ChatAnywhere API 配置指南

## 🚀 使用 ChatAnywhere API 服务

你的项目已经成功配置为使用 [ChatAnywhere](https://api.chatanywhere.tech) API 服务。这是一个开源的 OpenAI API 代理服务。

## ⚙️ 环境变量配置

### 1. 本地开发环境

项目已经配置了以下环境变量：

```bash
# .env.local
OPENAI_API_KEY=sk-AmL2hVkQ9rmDYGxBOiOP5Hxf2OkWKXRCBzzpye8KiSx1WHe8
OPENAI_BASE_URL=https://api.chatanywhere.tech
OPENAI_MODEL_NAME=gpt-3.5-turbo
```

### 2. Vercel 部署环境

在 Vercel 控制台中配置以下环境变量：

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 找到你的项目：`wechat-official-account-ai-workflow-uico`
3. 点击 **Settings** > **Environment Variables**
4. 添加以下环境变量：

```
OPENAI_API_KEY=sk-AmL2hVkQ9rmDYGxBOiOP5Hxf2OkWKXRCBzzpye8KiSx1WHe8
OPENAI_BASE_URL=https://api.chatanywhere.tech
OPENAI_MODEL_NAME=gpt-3.5-turbo
```

**注意：**
- 确保选择 **Production** 环境
- 点击 **Save** 保存配置

## 🔧 代码变更说明

### 主要变更：

1. **API 端点：**
   - 使用 ChatAnywhere 的 API 端点：`https://api.chatanywhere.tech`
   - 支持自定义 base URL 配置

2. **认证方式：**
   - 使用标准的 OpenAI API 认证：`Authorization: Bearer <api-key>`

3. **环境变量：**
   - `OPENAI_API_KEY`: 你的 API 密钥
   - `OPENAI_BASE_URL`: ChatAnywhere API 端点
   - `OPENAI_MODEL_NAME`: 使用的模型名称

### 更新的文件：

- `src/app/api/test-connection/route.ts`
- `src/app/api/generate/route.ts`
- `src/app/api/health/route.ts`
- `check-vercel-deployment.js`

## 🧪 测试结果

### 本地测试结果：

✅ **健康检查**: 通过
```json
{
  "status": "ok",
  "envCheck": {
    "allConfigured": true,
    "configured": {
      "OPENAI_API_KEY": "已配置",
      "OPENAI_BASE_URL": "已配置"
    }
  }
}
```

✅ **API连接测试**: 通过
```json
{
  "status": "ok",
  "apiTest": {
    "success": true,
    "response": "ChatAnywhere API连接测试成功!",
    "model": "gpt-3.5-turbo-0125"
  }
}
```

✅ **内容生成测试**: 通过
```json
{
  "success": true,
  "data": "人工智能真的能代替人类思考吗？\n未来十年，人工智能将如何改变我们的生活？\n探秘人工智能背后的\"黑科技\"，你知道多少？\n人工智能技术的突破，带来了哪些惊人的成果？\n人工智能如何助力医疗行业实现智慧转型？",
  "type": "title"
}
```

## 🚀 部署步骤

1. **配置 Vercel 环境变量**（如上所述）

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

## 💰 成本优势

使用 ChatAnywhere API 的优势：

1. **免费使用**: ChatAnywhere 提供免费的 API 服务
2. **无限制**: 没有严格的请求频率限制
3. **开源**: 可以自己部署和管理
4. **兼容性**: 完全兼容 OpenAI API 格式

## 🔒 安全注意事项

1. **API 密钥安全：**
   - 使用环境变量存储 API 密钥
   - 不要在代码中硬编码敏感信息
   - 定期检查 API 密钥的有效性

2. **请求限制：**
   - 设置合理的 `max_tokens` 限制
   - 实现请求频率限制
   - 监控 API 使用量

3. **错误处理：**
   - 实现完善的错误处理机制
   - 记录 API 调用日志
   - 设置超时处理

## 📞 故障排除

### 常见问题：

1. **401 错误：**
   - 检查 API 密钥是否正确
   - 确认环境变量已配置

2. **连接超时：**
   - 检查网络连接
   - 确认 API 端点可访问

3. **500 错误：**
   - 检查 Vercel 函数日志
   - 确认代码没有语法错误

### 获取帮助：

- [ChatAnywhere GitHub](https://github.com/chatanywhere/GPT_API_free)
- [Vercel 文档](https://vercel.com/docs)
- 查看项目中的 `VERCEL_500_TROUBLESHOOTING.md`

## 🎯 下一步

1. **部署到 Vercel**：
   ```bash
   npx vercel --prod
   ```

2. **配置环境变量**：在 Vercel 控制台设置

3. **测试部署**：
   ```bash
   node check-vercel-deployment.js
   ```

4. **开始使用**：访问你的应用并测试功能

---

**🎉 恭喜！你的应用现在使用 ChatAnywhere API 服务，可以免费生成高质量的内容了！**

