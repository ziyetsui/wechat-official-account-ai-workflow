#!/usr/bin/env node

const https = require('https');

console.log('🧪 测试核心功能 API（ChatAI API）')
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
      endpoint: '/api/generate',
      data: { topic: '人工智能', type: 'content' },
      description: '内容生成测试（ChatAI API）'
    },
    {
      endpoint: '/api/generate',
      data: { topic: '人工智能', type: 'title' },
      description: '标题生成测试（ChatAI API）'
    },
    {
      endpoint: '/api/generate',
      data: { topic: '人工智能', type: 'outline' },
      description: '大纲生成测试（ChatAI API）'
    },
    {
      endpoint: '/api/format',
      data: { article: '这是一篇关于人工智能的测试文章。人工智能正在改变我们的世界，从智能手机到自动驾驶汽车，AI技术无处不在。' },
      description: '文章排版测试（ChatAI API）'
    }
  ];

  console.log('📡 开始测试核心功能 API...')
  console.log('')

  let successCount = 0
  let totalCount = tests.length

  for (const test of tests) {
    try {
      console.log(`🔍 测试: ${test.description}`)
      const result = await testAPI(test.endpoint, test.data, test.description);
      
      console.log(`状态码: ${result.status}`)
      console.log(`成功: ${result.success ? '✅' : '❌'}`)
      
      if (result.success) {
        successCount++
      }
      
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
  console.log(`✅ 成功: ${successCount}/${totalCount}`)
  console.log(`❌ 失败: ${totalCount - successCount}/${totalCount}`)
  console.log('')
  
  if (successCount === totalCount) {
    console.log('🎉 所有核心功能 API 都工作正常！ChatAI API 集成成功！')
  } else {
    console.log('⚠️ 部分 API 存在问题，请检查错误信息')
  }
  
  console.log('')
  console.log('🌐 核心功能 API 端点:')
  console.log('- 内容生成: /api/generate (ChatAI API)')
  console.log('  * 文章生成: type=content')
  console.log('  * 标题生成: type=title')
  console.log('  * 大纲生成: type=outline')
  console.log('- 文章排版: /api/format (ChatAI API)')
  console.log('')
  console.log('💡 测试命令示例:')
  console.log('# 生成文章')
  console.log('curl -X POST "https://wechat-official-account-ai-workflow-ivory.vercel.app/api/generate" \\')
  console.log('  -H "Content-Type: application/json" \\')
  console.log('  -d \'{"topic": "人工智能", "type": "content"}\'')
  console.log('')
  console.log('# 文章排版')
  console.log('curl -X POST "https://wechat-official-account-ai-workflow-ivory.vercel.app/api/format" \\')
  console.log('  -H "Content-Type: application/json" \\')
  console.log('  -d \'{"article": "你的文章内容"}\'')
}

main();
