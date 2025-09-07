# Vercel 环境变量配置指南

## 🚀 部署状态

✅ **项目已部署到 Vercel**
- 网站地址：https://wechat-official-account-ai-workflow-ivory.vercel.app
- 部署状态：Ready
- 自动部署：已启用（GitHub 集成）

## ⚙️ 环境变量配置

### 必需的环境变量

你需要在 Vercel 控制台中配置以下环境变量：

#### 1. 访问 Vercel 控制台
- 打开：https://vercel.com/dashboard
- 找到项目：`wechat-official-account-ai-workflow-ivory`

#### 2. 配置环境变量
- 点击 **Settings** > **Environment Variables**
- 添加以下变量：

```
GEMINI_API_KEY = AIzaSyAjVdNMbHndiBgWv-dvDPIcsJ2OQFDu6ug
GEMINI_BASE_URL = https://api.246520.xyz
GEMINI_MODEL_NAME = gemini-2.5-pro
```

#### 3. 选择环境
- 确保选择 **Production** 环境
- 点击 **Save**

### 可选的环境变量（用于发布功能）

```
WECHAT_APP_ID = your_wechat_app_id
WECHAT_APP_SECRET = your_wechat_app_secret
```

## 🔍 测试部署

### 1. 健康检查
访问：https://wechat-official-account-ai-workflow-ivory.vercel.app/api/health

预期响应：
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

### 2. 功能测试

#### 主页面
访问：https://wechat-official-account-ai-workflow-ivory.vercel.app/

#### 排版工具
访问：https://wechat-official-account-ai-workflow-ivory.vercel.app/format

#### API 测试
```bash
curl -X POST "https://wechat-official-account-ai-workflow-ivory.vercel.app/api/format" \
  -H "Content-Type: application/json" \
  -d '{"article":"测试文章"}'
```

## 📊 当前功能状态

根据配置情况：

- ✅ **AI 内容生成**：正常工作
- ✅ **AI 标题生成**：正常工作
- ✅ **AI 配图建议**：正常工作
- ✅ **AI 文章排版**：正常工作
- ⚠️ **微信公众号发布**：需要配置微信 API

## 🔧 故障排除

### 如果 API 仍然失败：

1. **检查环境变量**：
   - 确认所有环境变量都已正确配置
   - 确认选择了正确的环境（Production）

2. **重新部署**：
   - 在 Vercel 控制台点击 **Redeploy**
   - 等待部署完成

3. **查看日志**：
   - 在 Vercel 控制台查看函数日志
   - 检查是否有错误信息

### 常见问题：

1. **环境变量未生效**：
   - 重新部署项目
   - 检查环境选择

2. **API 调用失败**：
   - 检查 Gemini API 密钥
   - 确认 API 端点可访问

3. **构建失败**：
   - 查看构建日志
   - 检查代码错误

## 🎉 部署完成

配置环境变量后，你的微信公众号 AI 助手将完全正常工作！

### 功能包括：
- ✅ AI 内容生成
- ✅ 智能标题生成
- ✅ 配图建议
- ✅ 文章排版
- ✅ 微信公众号发布（可选）

### 访问地址：
- 主站：https://wechat-official-account-ai-workflow-ivory.vercel.app
- 健康检查：https://wechat-official-account-ai-workflow-ivory.vercel.app/api/health
- 排版工具：https://wechat-official-account-ai-workflow-ivory.vercel.app/format

## 🚀 快速部署命令

如果你想使用命令行快速配置：

```bash
# 运行自动配置脚本
./deploy-to-vercel-complete.sh

# 或手动配置
vercel env add GEMINI_API_KEY production
vercel env add GEMINI_BASE_URL production
vercel env add GEMINI_MODEL_NAME production
vercel --prod
```

## 📞 支持

- **Vercel 文档**：https://vercel.com/docs
- **Next.js 文档**：https://nextjs.org/docs
- **项目 GitHub**：https://github.com/ziyetsui/wechat-official-account-ai-workflow
