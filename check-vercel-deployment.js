#!/usr/bin/env node

const https = require('https');
const { execSync } = require('child_process');

// 配置
const CONFIG = {
  // 替换为你的Vercel域名
  vercelUrl: 'https://wechat-official-account-ai-workflow-uico-r5w95ec7s.vercel.app',
  endpoints: [
    '/api/health',
    '/api/test-connection',
    '/api/generate'
  ],
  requiredEnvVars: [
    'GEMINI_API_KEY',
    'GEMINI_BASE_URL'
  ]
};

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// HTTP请求函数 - 支持GET和POST
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isPost = options.method === 'POST';
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Vercel-Diagnostic-Tool/1.0',
        ...options.headers
      }
    };

    if (isPost && options.body) {
      requestOptions.headers['Content-Length'] = Buffer.byteLength(options.body);
    }

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData,
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers,
            error: 'Invalid JSON response'
          });
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (isPost && options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// 检查环境变量
async function checkEnvironmentVariables() {
  log('\n🔍 检查环境变量配置...', 'cyan');
  
  try {
    const response = await makeRequest(`${CONFIG.vercelUrl}/api/health`);
    
    if (response.status === 200) {
      const envCheck = response.data.envCheck;
      
      if (envCheck && envCheck.allConfigured) {
        log('✅ 所有必需的环境变量都已配置', 'green');
        log('配置详情:', 'blue');
        Object.entries(envCheck.configured).forEach(([key, value]) => {
          log(`  ${key}: ${value}`, value === '已配置' ? 'green' : 'red');
        });
        return true;
      } else {
        log('❌ 环境变量配置不完整', 'red');
        if (envCheck && envCheck.missing) {
          log('缺少的环境变量:', 'yellow');
          envCheck.missing.forEach(varName => {
            log(`  - ${varName}`, 'red');
          });
        } else {
          log('无法获取环境变量信息', 'yellow');
        }
        return false;
      }
    } else {
      log(`❌ 健康检查失败 (${response.status})`, 'red');
      if (response.data && response.data.error) {
        log(`错误信息: ${response.data.error}`, 'red');
      }
      return false;
    }
  } catch (error) {
    log(`❌ 健康检查异常: ${error.message}`, 'red');
    return false;
  }
}

// 测试API连接
async function testApiConnection() {
  log('\n🔗 测试API连接...', 'cyan');
  
  try {
    const response = await makeRequest(`${CONFIG.vercelUrl}/api/test-connection`);
    
    if (response.status === 200) {
      const result = response.data;
      
      if (result.apiTest && result.apiTest.success) {
        log('✅ API连接测试成功', 'green');
        log(`响应: ${result.apiTest.response}`, 'green');
        return true;
      } else {
        log('❌ API连接测试失败', 'red');
        if (result.apiTest) {
          log(`错误: ${result.apiTest.error}`, 'red');
          if (result.apiTest.details) {
            log(`详情: ${result.apiTest.details}`, 'yellow');
          }
        }
        return false;
      }
    } else {
      log(`❌ API连接测试失败 (${response.status})`, 'red');
      if (response.data && response.data.error) {
        log(`错误信息: ${response.data.error}`, 'red');
      }
      return false;
    }
  } catch (error) {
    log(`❌ API连接测试异常: ${error.message}`, 'red');
    return false;
  }
}

// 测试内容生成
async function testContentGeneration() {
  log('\n📝 测试内容生成...', 'cyan');
  
  try {
    const testData = JSON.stringify({
      topic: '人工智能',
      type: 'title'
    });
    
    const response = await makeRequest(`${CONFIG.vercelUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: testData
    });
    
    if (response.status === 200) {
      const result = response.data;
      
      if (result.success) {
        log('✅ 内容生成测试成功', 'green');
        log(`生成内容: ${result.data.substring(0, 100)}...`, 'green');
        return true;
      } else {
        log('❌ 内容生成测试失败', 'red');
        log(`错误: ${result.error}`, 'red');
        return false;
      }
    } else {
      log(`❌ 内容生成测试失败 (${response.status})`, 'red');
      if (response.data && response.data.error) {
        log(`错误信息: ${response.data.error}`, 'red');
      }
      return false;
    }
  } catch (error) {
    log(`❌ 内容生成测试异常: ${error.message}`, 'red');
    return false;
  }
}

// 生成修复建议
function generateFixSuggestions(envOk, apiOk, genOk) {
  log('\n🔧 修复建议:', 'magenta');
  
  if (!envOk) {
    log('\n1. 环境变量配置问题:', 'yellow');
    log('   在Vercel控制台中配置以下环境变量:', 'blue');
    CONFIG.requiredEnvVars.forEach(varName => {
      log(`   - ${varName}`, 'cyan');
    });
    log('\n   配置步骤:', 'blue');
    log('   1. 访问 https://vercel.com/dashboard', 'cyan');
    log('   2. 找到你的项目', 'cyan');
    log('   3. 点击 Settings > Environment Variables', 'cyan');
    log('   4. 添加上述环境变量', 'cyan');
    log('   5. 重新部署项目', 'cyan');
  }
  
  if (!apiOk) {
    log('\n2. API连接问题:', 'yellow');
    log('   可能的原因:', 'blue');
    log('   - API密钥无效或过期', 'cyan');
    log('   - API端点不可访问', 'cyan');
    log('   - 网络连接问题', 'cyan');
    log('\n   建议:', 'blue');
    log('   - 检查API密钥是否正确', 'cyan');
    log('   - 确认API端点可访问', 'cyan');
    log('   - 查看Vercel函数日志', 'cyan');
  }
  
  if (!genOk) {
    log('\n3. 内容生成问题:', 'yellow');
    log('   可能的原因:', 'blue');
    log('   - API调用超时', 'cyan');
    log('   - 请求参数错误', 'cyan');
    log('   - 模型配置问题', 'cyan');
    log('\n   建议:', 'blue');
    log('   - 检查请求参数格式', 'cyan');
    log('   - 确认模型名称正确', 'cyan');
    log('   - 查看详细错误日志', 'cyan');
  }
  
  if (envOk && apiOk && genOk) {
    log('\n🎉 所有测试通过！部署正常。', 'green');
  }
}

// 主函数
async function main() {
  log('🚀 Vercel部署诊断工具', 'bright');
  log('==================================================', 'blue');
  
  const envOk = await checkEnvironmentVariables();
  const apiOk = await testApiConnection();
  const genOk = await testContentGeneration();
  
  log('\n📊 诊断结果:', 'magenta');
  log(`环境变量: ${envOk ? '✅' : '❌'}`, envOk ? 'green' : 'red');
  log(`API连接: ${apiOk ? '✅' : '❌'}`, apiOk ? 'green' : 'red');
  log(`内容生成: ${genOk ? '✅' : '❌'}`, genOk ? 'green' : 'red');
  
  generateFixSuggestions(envOk, apiOk, genOk);
  
  log('\n📝 查看详细日志:', 'blue');
  log('1. Vercel控制台 > Functions > 查看函数日志', 'cyan');
  log('2. 使用命令: vercel logs', 'cyan');
  log('3. 访问: https://vercel.com/dashboard', 'cyan');
}

// 运行诊断
if (require.main === module) {
  main().catch(error => {
    log(`\n❌ 诊断工具运行失败: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { main, checkEnvironmentVariables, testApiConnection, testContentGeneration };
