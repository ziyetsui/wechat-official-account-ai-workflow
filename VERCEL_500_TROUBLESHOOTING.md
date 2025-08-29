# Vercel 500错误故障排除指南

## 🚨 问题描述

你的应用在本地运行正常，但在 Vercel 上出现 500 内部服务器错误。这是一个常见的部署问题，通常由环境差异导致。

## 🔍 快速诊断

### 1. 运行诊断工具

```bash
# 运行自动诊断
node check-vercel-deployment.js

# 或运行修复脚本
./fix-vercel-500.sh
```

### 2. 手动检查步骤

#### 步骤1: 检查健康状态
访问: `https://your-app.vercel.app/api/health`

预期响应:
```json
{
  "status": "ok",
  "envCheck": {
    "allConfigured": true,
    "configured": {
      "AZURE_OPENAI_BASE_URL": "已配置",
      "AZURE_OPENAI_API_VERSION": "已配置",
      "AZURE_OPENAI_API_KEY": "已配置",
      "AZURE_OPENAI_MODEL_NAME": "已配置"
    }
  }
}
```

#### 步骤2: 测试API连接
访问: `https://your-app.vercel.app/api/test-connection`

#### 步骤3: 查看Vercel日志
```bash
vercel logs
```

## 🛠️ 常见问题及解决方案

### 问题1: 环境变量未配置

**症状:**
- 健康检查返回 503 状态
- 错误信息包含 "环境变量配置不完整"

**解决方案:**
1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 找到你的项目
3. 点击 **Settings** > **Environment Variables**
4. 添加以下环境变量:

```
AZURE_OPENAI_BASE_URL=https://gpt-i18n.byteintl.net/gpt/openapi/online/v2/crawl/openai/deployments/gpt_openapi
AZURE_OPENAI_API_VERSION=2024-03-01-preview
AZURE_OPENAI_API_KEY=I2brwSdmty3dYeCtPIderK1lJzrIHYcc_GPT_AK
AZURE_OPENAI_MODEL_NAME=gemini-2.5-pro
```

5. 选择 **Production** 环境
6. 点击 **Save**
7. 重新部署项目

### 问题2: API调用超时

**症状:**
- 请求超过10秒无响应
- 错误信息包含 "请求超时"

**解决方案:**
1. **优化API调用:**
   ```typescript
   // 使用AbortController设置超时
   const controller = new AbortController()
   const timeoutId = setTimeout(() => controller.abort(), 8000) // 8秒超时
   
   try {
     const response = await fetch(url, {
       signal: controller.signal,
       // ... 其他配置
     })
     clearTimeout(timeoutId)
   } catch (error) {
     clearTimeout(timeoutId)
     // 处理错误
   }
   ```

2. **升级到Vercel Pro:**
   - Pro版本支持60秒超时
   - 更好的性能和稳定性

### 问题3: 硬编码的API密钥

**症状:**
- 代码中包含硬编码的API密钥
- 在Vercel环境中可能不安全

**解决方案:**
1. **移除硬编码值:**
   ```typescript
   // ❌ 错误做法
   const apiKey = "I2brwSdmty3dYeCtPIderK1lJzrIHYcc_GPT_AK"
   
   // ✅ 正确做法
   const apiKey = process.env.AZURE_OPENAI_API_KEY
   if (!apiKey) {
     throw new Error('API密钥未配置')
   }
   ```

2. **使用环境变量检查:**
   ```typescript
   function checkEnvironmentVariables() {
     const required = ['AZURE_OPENAI_API_KEY', 'AZURE_OPENAI_BASE_URL']
     const missing = required.filter(key => !process.env[key])
     
     if (missing.length > 0) {
       throw new Error(`缺少环境变量: ${missing.join(', ')}`)
     }
   }
   ```

### 问题4: 依赖项问题

**症状:**
- 构建失败
- 模块未找到错误

**解决方案:**
1. **检查package.json:**
   ```json
   {
     "dependencies": {
       "next": "14.0.4",
       "react": "^18",
       "react-dom": "^18"
     }
   }
   ```

2. **清理并重新安装:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **检查Node.js版本:**
   ```bash
   node --version
   # 确保版本 >= 18
   ```

### 问题5: 文件系统操作

**症状:**
- 尝试写入本地文件
- ENOENT错误

**解决方案:**
1. **使用临时目录:**
   ```typescript
   import { writeFile } from 'fs/promises'
   import { join } from 'path'
   import { tmpdir } from 'os'
   
   const tempFile = join(tmpdir(), 'temp.json')
   await writeFile(tempFile, data)
   ```

2. **使用数据库或云存储:**
   - 避免文件系统操作
   - 使用数据库存储数据
   - 使用云存储服务

## 🔧 调试技巧

### 1. 添加详细日志

```typescript
export async function POST(request: NextRequest) {
  try {
    console.log('=== API调用开始 ===')
    console.log('环境:', process.env.NODE_ENV)
    console.log('时间:', new Date().toISOString())
    
    // ... 你的代码
    
    console.log('=== API调用成功 ===')
    return NextResponse.json(result)
  } catch (error) {
    console.error('=== API调用失败 ===')
    console.error('错误:', error.message)
    console.error('堆栈:', error.stack)
    
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
```

### 2. 查看Vercel函数日志

```bash
# 查看实时日志
vercel logs --follow

# 查看特定函数的日志
vercel logs --function=api/test-connection
```

### 3. 本地模拟Vercel环境

```bash
# 使用Vercel CLI本地开发
vercel dev

# 或使用生产模式
npm run build
npm start
```

## 📋 检查清单

在部署前，请确认以下项目:

- [ ] 所有环境变量已在Vercel控制台配置
- [ ] 代码中没有硬编码的API密钥
- [ ] 没有文件系统写入操作
- [ ] API调用有适当的超时处理
- [ ] 所有依赖项都已正确安装
- [ ] 本地构建测试通过
- [ ] 错误处理完善

## 🚀 快速修复命令

```bash
# 1. 运行自动修复脚本
./fix-vercel-500.sh

# 2. 手动修复步骤
npm run build
vercel --prod

# 3. 检查部署状态
node check-vercel-deployment.js
```

## 📞 获取帮助

如果问题仍然存在:

1. **查看Vercel文档:** https://vercel.com/docs
2. **检查Vercel状态:** https://vercel-status.com
3. **查看函数日志:** `vercel logs`
4. **联系Vercel支持:** 在Vercel控制台提交支持请求

## 🎯 预防措施

1. **使用TypeScript:** 提前发现类型错误
2. **添加测试:** 确保代码质量
3. **使用环境变量:** 避免硬编码敏感信息
4. **监控日志:** 及时发现和解决问题
5. **定期更新依赖:** 保持安全性

---

**记住:** 500错误通常是配置问题，而不是代码逻辑问题。按照上述步骤逐一排查，大多数问题都能得到解决。

