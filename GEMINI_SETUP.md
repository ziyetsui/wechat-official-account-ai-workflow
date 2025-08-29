# Gemini API 配置指南

## 🚀 使用 Gemini API 服务

你的项目已经成功配置为使用 Gemini API 服务。这是一个强大的多模态 AI 模型，支持文本生成、图像理解等功能。

## ⚙️ 环境变量配置

### 1. 本地开发环境

项目已经配置了以下环境变量：

```bash
# .env.local
GEMINI_API_KEY=AIzaSyAjVdNMbHndiBgWv-dvDPIcsJ2OQFDu6ug
GEMINI_BASE_URL=https://api.246520.xyz
GEMINI_MODEL_NAME=gemini-2.0-flash-exp
```

### 2. Vercel 部署环境

在 Vercel 控制台中配置以下环境变量：

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 找到你的项目：`wechat-official-account-ai-workflow-uico`
3. 点击 **Settings** > **Environment Variables**
4. 添加以下环境变量：

```
GEMINI_API_KEY=AIzaSyAjVdNMbHndiBgWv-dvDPIcsJ2OQFDu6ug
GEMINI_BASE_URL=https://api.246520.xyz
GEMINI_MODEL_NAME=gemini-2.0-flash-exp
```

**注意：**
- 确保选择 **Production** 环境
- 点击 **Save** 保存配置

## 🔧 代码变更说明

### 主要变更：

1. **API 端点：**
   - 使用 Gemini API 端点：`https://api.246520.xyz`
   - 支持自定义 base URL 配置

2. **API 格式：**
   - 使用 Google Gemini API 格式
   - 请求体结构：`contents` 和 `parts`
   - 响应结构：`candidates` 和 `content.parts`

3. **环境变量：**
   - `GEMINI_API_KEY`: 你的 API 密钥
   - `GEMINI_BASE_URL`: Gemini API 端点
   - `GEMINI_MODEL_NAME`: 使用的模型名称

### 更新的文件：

- `src/app/api/test-connection/route.ts`
- `src/app/api/generate/route.ts`
- `src/app/api/health/route.ts`
- `check-vercel-deployment.js`

## 🤔 为什么使用 gemini-2.0-flash-exp 而不是 gemini-2.5-pro？

### 模型可用性说明：

1. **API 端点限制**：
   - 你使用的 API 端点 `https://api.246520.xyz` 可能不支持 `gemini-2.5-pro` 模型
   - 该端点返回 500 错误，表示内部服务器错误

2. **模型兼容性**：
   - `gemini-2.0-flash-exp` 是当前 API 端点支持的模型
   - 这个模型在测试中工作正常，能够成功生成内容

3. **性能对比**：
   - `gemini-2.0-flash-exp` 是 Gemini 2.0 的快速版本
   - 虽然名称不同，但性能仍然很好
   - 适合大多数文本生成任务

### 如何尝试其他模型：

如果你想使用 `gemini-2.5-pro`，可以：

1. **更换 API 端点**：
   ```bash
   GEMINI_BASE_URL=https://generativelanguage.googleapis.com
   ```

2. **使用官方 Google API**：
   - 申请 Google AI Studio 的 API 密钥
   - 使用官方的 API 端点

3. **检查模型可用性**：
   - 不同的第三方 API 提供商支持不同的模型
   - 需要根据具体提供商的支持情况选择模型

## 🧪 测试结果

### 本地测试结果：

✅ **健康检查**: 通过
```json
{
  "status": "ok",
  "envCheck": {
    "allConfigured": true,
    "configured": {
      "GEMINI_API_KEY": "已配置",
      "GEMINI_BASE_URL": "已配置"
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
    "response": "好的！Gemini 2.5 Pro API连接测试成功！",
    "model": "gemini-2.0-flash-exp"
  }
}
```

✅ **内容生成测试**: 通过
```json
{
  "success": true,
  "data": "人工智能时代，你还在原地踏步？\n人工智能正在重塑商业，这3个趋势你必须知道！\nAI浪潮来袭，你的工作会被取代吗？\n别再谈论人工智能了，它真的能解决你的问题吗？\n拥抱人工智能，开启你的未来！",
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

使用 Gemini API 的优势：

1. **高性能**: Gemini 2.0 Flash 是高效的 AI 模型
2. **多模态**: 支持文本、图像等多种输入
3. **免费额度**: Google 提供一定的免费使用额度
4. **稳定性**: Google 的云服务稳定性高

## 🔒 安全注意事项

1. **API 密钥安全：**
   - 使用环境变量存储 API 密钥
   - 不要在代码中硬编码敏感信息
   - 定期检查 API 密钥的有效性

2. **请求限制：**
   - 设置合理的 `maxOutputTokens` 限制
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
   - 可能是模型不支持，尝试更换模型

### 获取帮助：

- [Gemini API 文档](https://ai.google.dev/docs)
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

## 🔄 API 格式对比

### OpenAI 格式 vs Gemini 格式：

**OpenAI 请求格式：**
```json
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "user",
      "content": "Hello"
    }
  ],
  "max_tokens": 100
}
```

**Gemini 请求格式：**
```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "Hello"
        }
      ]
    }
  ],
  "generationConfig": {
    "maxOutputTokens": 100,
    "temperature": 0.7
  }
}
```

---

**🎉 恭喜！你的应用现在使用 Gemini API 服务，可以生成高质量的内容了！**

**注意：** 虽然使用的是 `gemini-2.0-flash-exp` 模型，但功能完全正常，能够满足你的内容生成需求。
