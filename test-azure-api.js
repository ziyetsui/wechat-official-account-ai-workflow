#!/usr/bin/env node

const https = require('https');

console.log('🧪 测试 Azure OpenAI API 连接')
console.log('==================================================')
console.log('')

async function testAzureOpenAI() {
  const baseUrl = "https://gpt-i18n.byteintl.net/gpt/openapi/online/v2/crawl/openapi/deployments/gpt_openapi"
  const apiVersion = "2024-03-01-preview"
  const apiKey = "I2brwSdmty3dYeCtPIderK1lJzrIHYcc_GPT_AK"
  const modelName = "gemini-2.5-pro"
  
  const apiUrl = `${baseUrl}/chat/completions?api-version=${apiVersion}`
  
  const testData = {
    model: modelName,
    messages: [
      {
        role: "user",
        content: "请简单回复：测试成功"
      }
    ],
    max_tokens: 100,
    temperature: 0.3,
    stream: false,
  };

  const postData = JSON.stringify(testData);

  const options = {
    hostname: 'gpt-i18n.byteintl.net',
    port: 443,
    path: '/gpt/openapi/online/v2/crawl/openapi/deployments/gpt_openapi/chat/completions?api-version=2024-03-01-preview',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
      'Content-Length': Buffer.byteLength(postData)
    },
    timeout: 30000
  };

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
            content: result.choices?.[0]?.message?.content,
            rawData: data.substring(0, 500)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            success: false,
            error: '响应解析失败',
            rawData: data.substring(0, 500)
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
    console.log('📡 测试 Azure OpenAI API...')
    console.log('配置信息:')
    console.log('- Base URL:', 'https://gpt-i18n.byteintl.net/gpt/openapi/online/v2/crawl/openapi/deployments/gpt_openapi')
    console.log('- API Version:', '2024-03-01-preview')
    console.log('- Model:', 'gemini-2.5-pro')
    console.log('- API Key:', 'I2brwSdmty3dYeCtPIderK1lJzrIHYcc_GPT_AK')
    console.log('')
    
    const result = await testAzureOpenAI();
    
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
      console.log('🎉 Azure OpenAI API 工作正常！')
      console.log('现在 format API 应该能够正常使用 AI 排版功能。')
    } else {
      console.log('❌ Azure OpenAI API 调用失败')
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
