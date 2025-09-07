#!/usr/bin/env node

const https = require('https');

console.log('🧪 测试新的 Gemini API 配置')
console.log('==================================================')
console.log('')

async function testNewGeminiAPI() {
  const apiKey = "AIzaSyAjVdNMbHndiBgWv-dvDPIcsJ2OQFDu6ug"
  const baseUrl = "https://api.246520.xyz"
  const modelName = "gemini-2.5-pro"
  
  const testData = {
    contents: [
      {
        parts: [
          {
            text: "请简单回复：测试成功"
          }
        ]
      }
    ],
    generationConfig: {
      maxOutputTokens: 100,
      temperature: 0.3,
    }
  };

  const postData = JSON.stringify(testData);

  const options = {
    hostname: 'api.246520.xyz',
    port: 443,
    path: `/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    },
    timeout: 30000
  };

  console.log('请求配置:')
  console.log('- Hostname:', options.hostname)
  console.log('- Path:', options.path)
  console.log('- Method:', options.method)
  console.log('')

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({
            status: res.statusCode,
            success: res.statusCode === 200,
            error: result.error,
            content: result.candidates?.[0]?.content?.parts?.[0]?.text,
            rawData: data.substring(0, 1000)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            success: false,
            error: '响应解析失败',
            rawData: data.substring(0, 1000)
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  try {
    console.log('📡 测试新的 Gemini API...')
    console.log('配置信息:')
    console.log('- API Key:', 'AIzaSyAjVdNMbHndiBgWv-dvDPIcsJ2OQFDu6ug')
    console.log('- Base URL:', 'https://api.246520.xyz')
    console.log('- Model:', 'gemini-2.5-pro')
    console.log('')
    
    const result = await testNewGeminiAPI();
    
    console.log('📊 测试结果:')
    console.log(`状态码: ${result.status}`)
    console.log(`成功: ${result.success ? '✅' : '❌'}`)
    
    if (result.error) {
      console.log(`错误: ${JSON.stringify(result.error, null, 2)}`)
    }
    
    if (result.content) {
      console.log(`响应内容: ${result.content}`)
    }
    
    if (result.rawData) {
      console.log(`原始响应: ${result.rawData}`)
    }
    
    console.log('')
    
    if (result.success) {
      console.log('🎉 新的 Gemini API 工作正常！')
      console.log('现在 format API 应该能够正常使用 AI 排版功能。')
    } else {
      console.log('❌ 新的 Gemini API 调用失败')
      console.log('可能的原因:')
      console.log('1. API 密钥无效或过期')
      console.log('2. 网络连接问题')
      console.log('3. API 端点不可访问')
      console.log('4. 模型名称不正确')
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message)
  }
}

main();
