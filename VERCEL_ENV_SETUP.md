# Vercel 环境变量配置指南

## 🚀 部署状态
✅ 代码已推送到GitHub，Vercel正在自动部署中...

## 📋 需要配置的环境变量

请在 Vercel 控制台中配置以下环境变量：

### Gemini API 配置
```
GEMINI_API_KEY = AIzaSyAN9X9v0GYqNnAu01XqYBL6oR0jAxGBpms
GEMINI_BASE_URL = https://api.246520.xyz
GEMINI_MODEL_NAME = gemini-2.5-pro-preview-05-06
```

## 🔧 配置步骤

1. **访问 Vercel Dashboard**
   - 打开 https://vercel.com/dashboard
   - 登录你的账户

2. **选择项目**
   - 找到项目：`wechat-official-account-ai-workflow`
   - 点击进入项目详情

3. **进入环境变量设置**
   - 点击 "Settings" 标签
   - 在左侧菜单选择 "Environment Variables"

4. **添加环境变量**
   - 点击 "Add New" 按钮
   - 逐个添加以下变量：

   **变量1：**
   - Name: `GEMINI_API_KEY`
   - Value: `AIzaSyAN9X9v0GYqNnAu01XqYBL6oR0jAxGBpms`
   - Environment: 选择 "Production", "Preview", "Development"
   - 点击 "Save"

   **变量2：**
   - Name: `GEMINI_BASE_URL`
   - Value: `https://api.246520.xyz`
   - Environment: 选择 "Production", "Preview", "Development"
   - 点击 "Save"

   **变量3：**
   - Name: `GEMINI_MODEL_NAME`
   - Value: `gemini-2.5-pro-preview-05-06`
   - Environment: 选择 "Production", "Preview", "Development"
   - 点击 "Save"

5. **重新部署**
   - 环境变量配置完成后，Vercel会自动重新部署
   - 或者手动点击 "Deployments" 标签，然后点击 "Redeploy"

## 🧪 测试API

配置完成后，使用以下命令测试API：

### 测试内容生成
```bash
curl -X POST "https://wechat-official-account-ai-workflow-ivory.vercel.app/api/generate" \
  -H "Content-Type: application/json" \
  -d '{"topic": "人工智能", "type": "content"}'
```

### 测试文章排版
```bash
curl -X POST "https://wechat-official-account-ai-workflow-ivory.vercel.app/api/format" \
  -H "Content-Type: application/json" \
  -d '{"article": "这是一篇关于人工智能的测试文章。人工智能正在改变我们的世界，从智能手机到自动驾驶汽车，AI技术无处不在。"}'
```

## 🌟 新功能特性

### 1. 自定义排版模板
- ✅ 已添加徐子叶公众号的完整排版模板
- ✅ 包含关注引导、作者信息、二维码等元素
- ✅ 支持AI生成的文章内容自动插入到模板中

### 2. 环境变量支持
- ✅ 支持通过Vercel环境变量配置API密钥
- ✅ 提供硬编码备用方案，确保服务可用性
- ✅ 支持不同环境（开发、预览、生产）的独立配置

### 3. 优化的API性能
- ✅ 15秒超时控制，避免长时间等待
- ✅ 详细的错误日志和调试信息
- ✅ 优雅的错误处理和备用方案

## 📱 网站地址

**主站：** https://wechat-official-account-ai-workflow-ivory.vercel.app/

**功能页面：**
- 首页：https://wechat-official-account-ai-workflow-ivory.vercel.app/
- 排版页面：https://wechat-official-account-ai-workflow-ivory.vercel.app/format

## ⚠️ 注意事项

1. **环境变量配置后需要重新部署才能生效**
2. **确保所有环境（Production, Preview, Development）都配置了相同的变量**
3. **API密钥请妥善保管，不要泄露**
4. **如果遇到问题，请检查Vercel的Function Logs**

## 🔍 故障排除

如果API不工作，请检查：
1. 环境变量是否正确配置
2. Vercel部署是否成功
3. Function Logs中是否有错误信息
4. API密钥是否有效

## 📞 支持

如有问题，请检查：
- Vercel Dashboard 的 Function Logs
- GitHub 仓库的 Actions 日志
- 浏览器开发者工具的 Network 标签
