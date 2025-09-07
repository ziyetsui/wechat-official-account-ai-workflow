#!/usr/bin/env node

const https = require('https');

console.log('🧪 测试新的 API 服务')
console.log('==================================================')
console.log('')

async function testAPI(endpoint, data, description) {
  const postData = JSON.stringify(data);

  const options = {
    hostname: 'wechat-official-account-ai-workflow-ivory.vercel.app',
    port: 443,
    path: endpoint,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    },
    timeout: 20000
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
            message: result.message,
            data: result.data,
            usage: result.usage,
            model: result.model,
            description: description
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            success: false,
            error: '响应解析失败',
            rawData: data.substring(0, 500),
            description: description
          });
        }
      });
    });

    req.on('error', (error) => {
      reject({ error: error.message, description: description });
    });

    req.on('timeout', () => {
      req.destroy();
      reject({ error: '请求超时', description: description });
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  const tests = [
    {
      endpoint: '/api/chat-new',
      data: { message: '你好，请简单介绍一下人工智能' },
      description: '聊天功能测试'
    },
    {
      endpoint: '/api/generate-new',
      data: { topic: '人工智能', type: 'content' },
      description: '内容生成测试'
    },
    {
      endpoint: '/api/generate-new',
      data: { topic: '人工智能', type: 'title' },
      description: '标题生成测试'
    },
    {
      endpoint: '/api/format-new',
      data: { article: '这是一篇关于人工智能的测试文章。人工智能正在改变我们的世界，从智能手机到自动驾驶汽车，AI技术无处不在。' },
      description: '文章排版测试'
    }
  ];

  console.log('📡 开始测试新的 API 服务...')
  console.log('')

  for (const test of tests) {
    try {
      console.log(`🔍 测试: ${test.description}`)
      const result = await testAPI(test.endpoint, test.data, test.description);
      
      console.log(`状态码: ${result.status}`)
      console.log(`成功: ${result.success ? '✅' : '❌'}`)
      
      if (result.error) {
        console.log(`错误: ${result.error}`)
      }
      
      if (result.message) {
        console.log('回复:')
        console.log(result.message.substring(0, 100) + (result.message.length > 100 ? '...' : ''))
      }
      
      if (result.data) {
        console.log('数据:')
        console.log(result.data.substring(0, 100) + (result.data.length > 100 ? '...' : ''))
      }
      
      if (result.usage) {
        console.log(`Token使用: ${result.usage.total_tokens}`)
      }
      
      if (result.model) {
        console.log(`模型: ${result.model}`)
      }
      
      console.log('')
      
    } catch (error) {
      console.error(`❌ ${test.description} 测试失败:`, error.error || error.message)
      console.log('')
    }
  }

  console.log('🎯 测试总结:')
  console.log('')
  console.log('🌐 新的 API 端点:')
  console.log('- 聊天: /api/chat-new')
  console.log('- 内容生成: /api/generate-new')
  console.log('- 文章排版: /api/format-new')
  console.log('')
  console.log('💡 测试命令示例:')
  console.log('curl -X POST "https://wechat-official-account-ai-workflow-ivory.vercel.app/api/chat-new" \\')
  console.log('  -H "Content-Type: application/json" \\')
  console.log('  -d \'{"message": "你好"}\'')
}

main();
