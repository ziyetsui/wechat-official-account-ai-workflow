# 微信公众号配置指南

## 配置步骤

### 1. 获取开发者信息
您已经获取了开发者ID：`wxc66e3754c009becc`

### 2. 获取开发者密码
1. 登录微信公众平台：https://mp.weixin.qq.com/
2. 进入"开发" -> "基本配置"
3. 在"开发者密码(AppSecret)"部分，点击"重置"按钮
4. 记录下新的开发者密码

### 3. 配置IP白名单
1. 在"基本配置"页面找到"IP白名单配置"
2. 添加您的服务器IP地址
3. 如果是本地开发，可以添加您的公网IP

### 4. 创建环境变量文件
在项目根目录创建 `.env.local` 文件，内容如下：

```bash
# Azure OpenAI Configuration
AZURE_OPENAI_BASE_URL=https://gpt-i18n.byteintl.net/gpt/openapi/online/v2/crawl/openai/deployments/gpt_openapi
AZURE_OPENAI_API_VERSION=2024-03-01-preview
AZURE_OPENAI_API_KEY=I2brwSdmty3dYeCtPIderK1lJzrIHYcc_GPT_AK
AZURE_OPENAI_MODEL_NAME=gemini-2.5-pro
AZURE_OPENAI_MAX_TOKENS=32000

# 微信公众号配置
WECHAT_APP_ID=wxc66e3754c009becc
WECHAT_APP_SECRET=您的开发者密码
```

### 5. 重启应用
配置完成后，重启开发服务器：

```bash
npm run dev
```

## 安全注意事项

1. **开发者密码安全**：开发者密码具有极高安全性，请妥善保管
2. **不要提交到代码库**：确保 `.env.local` 文件已添加到 `.gitignore`
3. **IP白名单**：确保服务器IP已添加到白名单
4. **定期更新**：建议定期更换开发者密码

## 测试发布功能

配置完成后，您可以：

1. 访问排版页面：http://localhost:3004/format
2. 输入文章内容并排版
3. 点击"发布到公众号"按钮
4. 选择"发送预览"或"发布文章"

## 常见问题

### Q: 提示"appid missing"错误
A: 检查 `.env.local` 文件中的 `WECHAT_APP_ID` 是否正确配置

### Q: 提示"开发者密码错误"
A: 检查 `WECHAT_APP_SECRET` 是否正确，可能需要重新获取开发者密码

### Q: 提示"IP不在白名单"
A: 在微信公众平台添加您的服务器IP到白名单

### Q: 预览功能不工作
A: 确保填写了正确的OpenID，OpenID是用户的唯一标识 