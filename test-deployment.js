#!/usr/bin/env node

const https = require('https');

console.log('🧪 测试 Vercel 部署状态')
console.log('==================================================')
console.log('')

async function testHealthCheck() {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'wechat-official-account-ai-workflow-ivory.vercel.app',
      port: 443,
      path: '/api/health',
      method: 'GET',
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({
            status: res.statusCode,
            success: res.statusCode === 200,
            data: result
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            success: false,
            error: '响应解析失败',
            rawData: data
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    req.end();
  });
}

async function testFormatAPI() {
  const testData = JSON.stringify({ article: "测试文章" });
  
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'wechat-official-account-ai-workflow-ivory.vercel.app',
      port: 443,
      path: '/api/format',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testData)
      },
      timeout: 30000
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({
            status: res.statusCode,
            success: result.success,
            hasWarning: !!result.warning,
            dataLength: result.data ? result.data.length : 0
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            success: false,
            error: '响应解析失败'
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    req.write(testData);
    req.end();
  });
}

async function main() {
  try {
    console.log('📡 测试健康检查...')
    const healthResult = await testHealthCheck();
    
    console.log('📊 健康检查结果:')
    console.log(`状态码: ${healthResult.status}`)
    console.log(`成功: ${healthResult.success ? '✅' : '❌'}`)
    
    if (healthResult.data) {
      console.log(`环境: ${healthResult.data.environment}`)
      console.log(`状态: ${healthResult.data.status}`)
      
      if (healthResult.data.envCheck) {
        console.log(`环境变量配置: ${healthResult.data.envCheck.allConfigured ? '✅ 完整' : '❌ 不完整'}`)
        if (healthResult.data.envCheck.configured) {
          Object.entries(healthResult.data.envCheck.configured).forEach(([key, value]) => {
            console.log(`  - ${key}: ${value}`)
          })
        }
      }
    }
    
    console.log('')
    console.log('📡 测试排版功能...')
    const formatResult = await testFormatAPI();
    
    console.log('📊 排版功能结果:')
    console.log(`状态码: ${formatResult.status}`)
    console.log(`成功: ${formatResult.success ? '✅' : '❌'}`)
    
    if (formatResult.hasWarning) {
      console.log(`⚠️  使用备用方案: 是`)
    } else {
      console.log(`🎉 使用AI排版: 是`)
    }
    
    console.log(`内容长度: ${formatResult.dataLength} 字符`)
    
    console.log('')
    console.log('🎯 部署状态总结:')
    
    if (healthResult.success && formatResult.success) {
      console.log('✅ 部署成功！所有功能正常工作')
      console.log('')
      console.log('🌐 访问地址:')
      console.log('- 主站: https://wechat-official-account-ai-workflow-ivory.vercel.app')
      console.log('- 排版工具: https://wechat-official-account-ai-workflow-ivory.vercel.app/format')
      console.log('- 健康检查: https://wechat-official-account-ai-workflow-ivory.vercel.app/api/health')
      
      if (formatResult.hasWarning) {
        console.log('')
        console.log('💡 提示: 排版功能使用备用方案，如需完整AI功能，请配置环境变量')
      } else {
        console.log('')
        console.log('🎉 完美！AI排版功能正常工作')
      }
    } else {
      console.log('❌ 部署存在问题，请检查配置')
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
