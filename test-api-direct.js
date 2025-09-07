#!/usr/bin/env node

const https = require('https');

console.log('🧪 直接测试ChatAI API')
console.log('==================================================')
console.log('')

async function testChatAIAPI() {
  const apiKey = "sk-2dFvkITb1mr3yG7FdIYkc62mZPZKMSIsvdU0dLKaiyduuO3B"
  const baseUrl = "https://www.chataiapi.com/v1"
  const modelName = "gpt-3.5-turbo"
  
  const requestBody = {
    model: modelName,
    messages: [
      {
        role: 'user',
        content: 'Hello, please respond with "API is working"'
      }
    ],
    max_tokens: 50,
    temperature: 0.7
  }

  const postData = JSON.stringify(requestBody)

  const options = {
    hostname: 'www.chataiapi.com',
    port: 443,
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Content-Length': Buffer.byteLength(postData)
    },
    timeout: 10000 // 10秒超时
  }

  return new Promise((resolve) => {
    console.log('🔍 测试ChatAI API连接...')
    console.log('API Key:', apiKey.substring(0, 10) + '...')
    console.log('Base URL:', baseUrl)
    console.log('Model:', modelName)
    console.log('')

    const req = https.request(options, (res) => {
      let rawData = ''
      
      console.log(`状态码: ${res.statusCode}`)
      console.log(`响应头:`, res.headers)
      
      res.on('data', (chunk) => {
        rawData += chunk
      })
      
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const parsedData = JSON.parse(rawData)
            console.log('✅ API调用成功!')
            console.log('响应数据:', JSON.stringify(parsedData, null, 2))
            resolve({ success: true, data: parsedData })
          } else {
            console.log('❌ API调用失败')
            console.log('错误响应:', rawData)
            resolve({ success: false, statusCode: res.statusCode, error: rawData })
          }
        } catch (e) {
          console.log('❌ 响应解析失败')
          console.log('原始响应:', rawData)
          resolve({ success: false, error: '响应解析失败', rawData })
        }
      })
    })

    req.on('error', (e) => {
      console.log('❌ 请求错误:', e.message)
      resolve({ success: false, error: e.message })
    })

    req.on('timeout', () => {
      req.destroy()
      console.log('❌ 请求超时')
      resolve({ success: false, error: '请求超时' })
    })

    req.write(postData)
    req.end()
  })
}

async function main() {
  const result = await testChatAIAPI()
  
  console.log('')
  console.log('🎯 测试结果:')
  if (result.success) {
    console.log('✅ ChatAI API 工作正常')
    console.log('💡 问题可能在于Vercel环境变量配置')
  } else {
    console.log('❌ ChatAI API 存在问题')
    console.log('错误:', result.error)
    console.log('💡 建议检查API密钥或服务状态')
  }
}

main()
