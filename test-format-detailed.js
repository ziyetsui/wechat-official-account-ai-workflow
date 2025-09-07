#!/usr/bin/env node

const https = require('https');

console.log('🧪 详细测试 Format API')
console.log('==================================================')
console.log('')

async function testFormatAPIDetailed() {
  const testData = {
    article: "人工智能正在改变世界。从智能手机到自动驾驶汽车，AI技术无处不在。我们需要了解这些变化，并做好准备迎接未来。"
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
            data: result.data,
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
    console.log('📡 发送测试请求...')
    const result = await testFormatAPIDetailed();
    
    console.log('📊 测试结果:')
    console.log(`状态码: ${result.status}`)
    console.log(`成功: ${result.success ? '✅' : '❌'}`)
    
    if (result.error) {
      console.log(`错误: ${result.error}`)
    }
    
    if (result.warning) {
      console.log(`⚠️  警告: ${result.warning}`)
    }
    
    if (result.data) {
      console.log('')
      console.log('📝 返回的内容:')
      console.log('=' * 50)
      console.log(result.data)
      console.log('=' * 50)
      
      // 分析内容
      const isBackup = result.isBackupSolution || result.data.includes('由于API服务暂时不可用')
      const hasAIContent = result.data.includes('人工智能') && result.data.length > 500
      
      console.log('')
      console.log('🔍 内容分析:')
      console.log(`- 使用备用方案: ${isBackup ? '是' : '否'}`)
      console.log(`- 包含AI生成内容: ${hasAIContent ? '是' : '否'}`)
      console.log(`- 内容长度: ${result.data.length} 字符`)
      
      if (isBackup) {
        console.log('')
        console.log('💡 说明: 当前使用的是备用排版方案')
        console.log('   这意味着AI API调用失败，但基础排版功能仍然可用')
      } else if (hasAIContent) {
        console.log('')
        console.log('🎉 成功: 使用了AI生成的排版内容！')
        console.log('   现在format功能完全正常工作了')
      }
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message)
  }
}

main();
