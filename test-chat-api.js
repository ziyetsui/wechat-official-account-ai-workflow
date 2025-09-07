#!/usr/bin/env node

const https = require('https');

console.log('🧪 测试新的聊天 API')
console.log('==================================================')
console.log('')

async function testChatAPI() {
  const testData = {
    message: "你好，请简单介绍一下人工智能的发展历程。"
  };

  const postData = JSON.stringify(testData);

  const options = {
    hostname: 'wechat-official-account-ai-workflow-ivory.vercel.app',
    port: 443,
    path: '/api/chat',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    },
    timeout: 15000
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
            usage: result.usage,
            model: result.model
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
    console.log('📡 测试聊天 API...')
    const result = await testChatAPI();
    
    console.log('📊 测试结果:')
    console.log(`状态码: ${result.status}`)
    console.log(`成功: ${result.success ? '✅' : '❌'}`)
    
    if (result.error) {
      console.log(`错误: ${result.error}`)
    }
    
    if (result.message) {
      console.log('')
      console.log('💬 AI 回复:')
      console.log('=' * 50)
      console.log(result.message)
      console.log('=' * 50)
    }
    
    if (result.usage) {
      console.log('')
      console.log('📊 使用统计:')
      console.log(`- 输入 Token: ${result.usage.promptTokenCount}`)
      console.log(`- 总 Token: ${result.usage.totalTokenCount}`)
    }
    
    if (result.model) {
      console.log(`- 模型: ${result.model}`)
    }
    
    console.log('')
    console.log('🎯 测试总结:')
    
    if (result.success) {
      console.log('✅ 聊天 API 工作正常！')
      console.log('')
      console.log('🌐 测试命令:')
      console.log('curl -X POST "https://wechat-official-account-ai-workflow-ivory.vercel.app/api/chat" \\')
      console.log('  -H "Content-Type: application/json" \\')
      console.log('  -d \'{"message": "你好"}\'')
    } else {
      console.log('❌ 聊天 API 存在问题')
      if (result.status === 504) {
        console.log('💡 建议: 请求超时，可能需要优化 API 配置')
      } else if (result.status === 500) {
        console.log('💡 建议: 服务器错误，请检查 API 配置')
      }
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message)
  }
}

main();
