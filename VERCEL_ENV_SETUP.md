# Vercel环境变量配置指南

## 🚀 部署状态

✅ **部署成功！**
- 网站地址：https://wechat-official-account-ai-workflow-ivory.vercel.app
- 部署状态：Ready
- 构建时间：32秒

## ⚙️ 环境变量配置

### 必需的环境变量

你需要在Vercel控制台中配置以下环境变量：

1. **访问Vercel控制台**：
   - 打开：https://vercel.com/dashboard
   - 找到项目：`wechat-official-account-ai-workflow-uico`

2. **配置环境变量**：
   - 点击 **Settings** > **Environment Variables**
   - 添加以下变量：

```
AZURE_OPENAI_BASE_URL=https://gpt-i18n.byteintl.net/gpt/openapi/online/v2/crawl/openai/deployments/gpt_openapi
AZURE_OPENAI_API_VERSION=2024-03-01-preview
AZURE_OPENAI_API_KEY=I2brwSdmty3dYeCtPIderK1lJzrIHYcc_GPT_AK
AZURE_OPENAI_MODEL_NAME=gemini-2.5-pro
AZURE_OPENAI_MAX_TOKENS=32000
```

3. **选择环境**：
   - 确保选择 **Production** 环境
   - 点击 **Save**

### 可选的环境变量（用于发布功能）

```
WECHAT_APP_ID=your_wechat_app_id
WECHAT_APP_SECRET=your_wechat_app_secret
```

## 🔍 测试部署

### 1. 健康检查
访问：https://wechat-official-account-ai-workflow-ivory.vercel.app/api/health

### 2. 主页面
访问：https://wechat-official-account-ai-workflow-ivory.vercel.app/

### 3. 功能测试
- 内容生成：在主页输入主题，点击生成
- 文章排版：访问 `/format` 页面
- 调试功能：访问 `/debug` 页面

## 📊 当前状态

根据健康检查结果：
- ✅ 环境变量配置：正确
- ❌ API连接测试：失败（需要配置环境变量）
- ✅ 部署状态：正常

## 🔧 故障排除

### 如果API仍然失败：

1. **检查环境变量**：
   - 确认所有环境变量都已正确配置
   - 确认选择了正确的环境（Production）

2. **重新部署**：
   - 在Vercel控制台点击 **Redeploy**
   - 等待部署完成

3. **查看日志**：
   - 在Vercel控制台查看函数日志
   - 检查是否有错误信息

### 常见问题：

1. **环境变量未生效**：
   - 重新部署项目
   - 检查环境选择

2. **API调用失败**：
   - 检查Azure OpenAI API密钥
   - 确认API端点可访问

3. **构建失败**：
   - 查看构建日志
   - 检查代码错误

## 🎉 部署完成

配置环境变量后，你的微信公众号AI助手将完全正常工作！

### 功能包括：
- ✅ AI内容生成
- ✅ 智能标题生成
- ✅ 配图建议
- ✅ 文章排版
- ✅ 微信公众号发布（可选）

### 访问地址：
- 主站：https://wechat-official-account-ai-workflow-ivory.vercel.app
- 健康检查：https://wechat-official-account-ai-workflow-ivory.vercel.app/api/health









