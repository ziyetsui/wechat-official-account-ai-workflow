#!/usr/bin/env node

const https = require('https');

console.log('🧪 测试 AI API 连接')
console.log('==================================================')
console.log('')

async function testAIConnection() {
  const testData = {
    topic: "人工智能的发展趋势",
    type: "content"
  };

  const postData = JSON.stringify(testData);

  const options = {
    hostname: 'wechat-official-account-ai-workflow-ivory.vercel.app',
    port: 443,
    path: '/api/generate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
            success: result.success,
            error: result.error,
            data: result.data ? result.data.substring(0, 200) + '...' : null
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
    console.log('📡 测试 AI 内容生成 API...')
    const result = await testAIConnection();
    
    console.log('📊 测试结果:')
    console.log(`状态码: ${result.status}`)
    console.log(`成功: ${result.success ? '✅' : '❌'}`)
    
    if (result.error) {
      console.log(`错误: ${result.error}`)
    }
    
    if (result.data) {
      console.log(`数据预览: ${result.data}`)
    }
    
    if (result.rawData) {
      console.log(`原始响应: ${result.rawData}`)
    }
    
    console.log('')
    
    if (result.success) {
      console.log('🎉 AI API 工作正常！')
      console.log('现在可以配置 format API 使用相同的环境变量。')
    } else {
      console.log('❌ AI API 也有问题')
      console.log('需要检查环境变量配置。')
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message)
  }
}

main();
