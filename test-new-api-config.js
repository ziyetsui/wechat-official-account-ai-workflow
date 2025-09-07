#!/usr/bin/env node

const https = require('https');

console.log('🧪 测试新的 API 配置')
console.log('==================================================')
console.log('')

async function testGenerateAPI() {
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

async function testFormatAPI() {
  const testData = {
    article: "人工智能正在改变世界。从智能手机到自动驾驶汽车，AI技术无处不在。"
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
            warning: result.warning,
            dataLength: result.data ? result.data.length : 0,
            isBackupSolution: result.warning ? true : false
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
    console.log('📡 测试内容生成 API...')
    const generateResult = await testGenerateAPI();
    
    console.log('📊 内容生成结果:')
    console.log(`状态码: ${generateResult.status}`)
    console.log(`成功: ${generateResult.success ? '✅' : '❌'}`)
    
    if (generateResult.error) {
      console.log(`错误: ${generateResult.error}`)
    }
    
    if (generateResult.data) {
      console.log(`数据预览: ${generateResult.data}`)
    }
    
    console.log('')
    console.log('📡 测试排版功能 API...')
    const formatResult = await testFormatAPI();
    
    console.log('📊 排版功能结果:')
    console.log(`状态码: ${formatResult.status}`)
    console.log(`成功: ${formatResult.success ? '✅' : '❌'}`)
    
    if (formatResult.error) {
      console.log(`错误: ${formatResult.error}`)
    }
    
    if (formatResult.warning) {
      console.log(`⚠️  警告: ${formatResult.warning}`)
    }
    
    console.log(`内容长度: ${formatResult.dataLength} 字符`)
    console.log(`使用备用方案: ${formatResult.isBackupSolution ? '是' : '否'}`)
    
    console.log('')
    console.log('🎯 API 配置测试总结:')
    
    if (generateResult.success && formatResult.success) {
      console.log('✅ 所有 API 都正常工作！')
      console.log('')
      console.log('🔧 当前配置:')
      console.log('- API Key: AIzaSyAjVdNMbHndiBgWv-dvDPIcsJ2OQFDu6ug')
      console.log('- Base URL: https://api.246520.xyz')
      console.log('- Model: gemini-2.5-pro')
      console.log('')
      console.log('🌐 访问地址:')
      console.log('- 主站: https://wechat-official-account-ai-workflow-ivory.vercel.app')
      console.log('- 排版工具: https://wechat-official-account-ai-workflow-ivory.vercel.app/format')
      
      if (formatResult.isBackupSolution) {
        console.log('')
        console.log('💡 提示: 排版功能使用备用方案，建议配置环境变量以获得最佳性能')
      } else {
        console.log('')
        console.log('🎉 完美！所有 AI 功能都正常工作')
      }
    } else {
      console.log('❌ 部分 API 存在问题，请检查配置')
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message)
  }
}

main();
