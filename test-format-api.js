#!/usr/bin/env node

const https = require('https');

console.log('🧪 测试 Format API')
console.log('==================================================')
console.log('')

async function testFormatAPI() {
  const testData = {
    article: "这是一篇测试文章，用于验证format API是否正常工作。"
  };

  const postData = JSON.stringify(testData);

  const options = {
    hostname: 'wechat-official-account-ai-workflow-ivory.vercel.app',
    port: 443,
    path: '/api/format',
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
            rawData: data.substring(0, 200)
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
    console.log('📡 发送测试请求...')
    const result = await testFormatAPI();
    
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
      console.log('🎉 Format API 测试成功！')
      console.log('现在可以在网页上正常使用排版功能了。')
    } else {
      console.log('❌ Format API 测试失败')
      console.log('')
      console.log('🔧 可能的解决方案:')
      console.log('1. 检查 Vercel 环境变量配置')
      console.log('2. 查看 Vercel 函数日志')
      console.log('3. 重新部署项目')
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message)
    console.log('')
    console.log('🔧 可能的解决方案:')
    console.log('1. 检查网络连接')
    console.log('2. 确认网站可访问')
    console.log('3. 查看 Vercel 部署状态')
  }
}

main();
