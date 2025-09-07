#!/usr/bin/env node

const https = require('https');

console.log('🧪 测试 Azure OpenAI API 连接（修正版）')
console.log('==================================================')
console.log('')

async function testAzureOpenAI() {
  // 根据你提供的信息，完整的API URL应该是：
  const fullApiUrl = "https://gpt-i18n.byteintl.net/gpt/openapi/online/v2/crawl/openapi/deployments/gpt_openapi/chat/completions?api-version=2024-03-01-preview"
  
  const apiKey = "I2brwSdmty3dYeCtPIderK1lJzrIHYcc_GPT_AK"
  const modelName = "gemini-2.5-pro"
  
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

  // 解析URL
  const url = new URL(fullApiUrl);
  
  const options = {
    hostname: url.hostname,
    port: 443,
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
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
            content: result.choices?.[0]?.message?.content,
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
    console.log('📡 测试 Azure OpenAI API...')
    
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
      console.log('5. API 版本不匹配')
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message)
  }
}

main();
