# 手动 Vercel 部署和环境变量配置指南

## 🚀 部署状态

✅ **项目已自动部署到 Vercel**
- 网站地址：https://wechat-official-account-ai-workflow-ivory.vercel.app
- 部署状态：Ready（通过 GitHub 自动部署）
- 自动部署：已启用

## ⚙️ 环境变量配置（手动方式）

### 方法一：通过 Vercel 控制台配置（推荐）

#### 1. 访问 Vercel 控制台
- 打开浏览器，访问：https://vercel.com/dashboard
- 使用你的 GitHub 账号登录

#### 2. 找到项目
- 在项目列表中找到：`wechat-official-account-ai-workflow-ivory`
- 点击项目名称进入项目详情页

#### 3. 配置环境变量
- 点击顶部的 **Settings** 标签页
- 在左侧菜单中找到 **Environment Variables**
- 点击 **Add New** 按钮

#### 4. 添加环境变量
依次添加以下三个环境变量：

**第一个环境变量：**
- Name: `GEMINI_API_KEY`
- Value: `AIzaSyAjVdNMbHndiBgWv-dvDPIcsJ2OQFDu6ug`
- Environment: 选择 `Production`
- 点击 **Save**

**第二个环境变量：**
- Name: `GEMINI_BASE_URL`
- Value: `https://api.246520.xyz`
- Environment: 选择 `Production`
- 点击 **Save**

**第三个环境变量：**
- Name: `GEMINI_MODEL_NAME`
- Value: `gemini-2.5-pro`
- Environment: 选择 `Production`
- 点击 **Save**

#### 5. 重新部署
- 配置完环境变量后，点击 **Deployments** 标签页
- 找到最新的部署记录
- 点击右侧的 **...** 菜单
- 选择 **Redeploy**
- 等待部署完成

### 方法二：通过 GitHub 配置（高级）

如果你熟悉 GitHub Actions，也可以通过 GitHub Secrets 配置：

1. 访问你的 GitHub 仓库
2. 点击 **Settings** > **Secrets and variables** > **Actions**
3. 添加以下 Secrets：
   - `GEMINI_API_KEY`
   - `GEMINI_BASE_URL`
   - `GEMINI_MODEL_NAME`

## 🔍 验证配置

### 1. 健康检查
访问：https://wechat-official-account-ai-workflow-ivory.vercel.app/api/health

如果配置正确，应该看到：
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

#### 测试排版功能
访问：https://wechat-official-account-ai-workflow-ivory.vercel.app/format

1. 在左侧输入框中输入测试文章
2. 点击"自动排版"按钮
3. 右侧应该显示 AI 生成的 HTML 代码

#### 测试内容生成
访问：https://wechat-official-account-ai-workflow-ivory.vercel.app/

1. 在输入框中输入主题
2. 点击"生成内容"按钮
3. 应该看到 AI 生成的文章内容

## 📊 功能状态

配置完成后，所有功能都应该正常工作：

- ✅ **AI 内容生成**：基于主题生成文章
- ✅ **AI 标题生成**：生成吸引人的标题
- ✅ **AI 配图建议**：推荐合适的配图
- ✅ **AI 文章排版**：转换为公众号格式
- ⚠️ **微信公众号发布**：需要额外配置微信 API

## 🔧 故障排除

### 如果功能仍然不工作：

1. **检查环境变量**：
   - 确认所有环境变量都已正确配置
   - 确认选择了 Production 环境
   - 确认变量名称完全正确（区分大小写）

2. **重新部署**：
   - 在 Vercel 控制台重新部署项目
   - 等待部署完成（通常需要 1-2 分钟）

3. **查看日志**：
   - 在 Vercel 控制台点击 **Functions** 标签页
   - 查看函数日志，检查是否有错误信息

4. **清除缓存**：
   - 在浏览器中按 Ctrl+F5 或 Cmd+Shift+R 强制刷新
   - 或者使用无痕模式访问

### 常见错误：

1. **环境变量未生效**：
   - 重新部署项目
   - 检查环境选择

2. **API 调用失败**：
   - 检查 API 密钥是否正确
   - 确认 API 端点可访问

3. **构建失败**：
   - 查看构建日志
   - 检查代码错误

## 🎉 部署完成

配置完成后，你的微信公众号 AI 助手将完全正常工作！

### 访问地址：
- **主站**：https://wechat-official-account-ai-workflow-ivory.vercel.app
- **排版工具**：https://wechat-official-account-ai-workflow-ivory.vercel.app/format
- **健康检查**：https://wechat-official-account-ai-workflow-ivory.vercel.app/api/health

### 功能特点：
- 🚀 自动部署（GitHub 集成）
- 🔒 环境变量安全配置
- 🌐 全球 CDN 加速
- 📱 响应式设计
- ⚡ 快速加载

## 📞 支持

如果遇到问题，可以：

1. 查看 Vercel 文档：https://vercel.com/docs
2. 检查项目 GitHub：https://github.com/ziyetsui/wechat-official-account-ai-workflow
3. 查看 Vercel 控制台的日志信息

---

**恭喜！你的微信公众号 AI 助手现在已经完全部署并配置完成！** 🎉
