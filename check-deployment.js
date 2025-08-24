#!/usr/bin/env node

// 部署前检查脚本
const fs = require('fs');
const path = require('path');

console.log('🔍 开始检查部署配置...\n');

// 检查必要文件
const requiredFiles = [
  'package.json',
  'Dockerfile',
  'next.config.js',
  'tsconfig.json',
  'src/app/page.tsx',
  'src/app/api/generate/route.ts',
  'src/app/api/format/route.ts',
  'src/app/api/publish/route.ts'
];

console.log('📋 检查必要文件...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - 文件不存在`);
    allFilesExist = false;
  }
});

console.log('');

// 检查环境变量配置
console.log('🔧 检查环境变量配置...');
const envFile = '.env.local';
if (fs.existsSync(envFile)) {
  console.log(`✅ ${envFile} 文件存在`);
  const envContent = fs.readFileSync(envFile, 'utf8');
  
  const requiredEnvVars = [
    'AZURE_OPENAI_BASE_URL',
    'AZURE_OPENAI_API_KEY',
    'WECHAT_APP_ID',
    'WECHAT_APP_SECRET'
  ];
  
  requiredEnvVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`✅ ${varName} 已配置`);
    } else {
      console.log(`❌ ${varName} 未配置`);
    }
  });
} else {
  console.log(`❌ ${envFile} 文件不存在`);
  console.log('请创建 .env.local 文件并配置环境变量');
}

console.log('');

// 检查 package.json
console.log('📦 检查 package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (packageJson.scripts && packageJson.scripts.build) {
    console.log('✅ build 脚本已配置');
  } else {
    console.log('❌ build 脚本未配置');
  }
  
  if (packageJson.scripts && packageJson.scripts.start) {
    console.log('✅ start 脚本已配置');
  } else {
    console.log('❌ start 脚本未配置');
  }
  
  if (packageJson.dependencies && packageJson.dependencies.next) {
    console.log('✅ Next.js 依赖已安装');
  } else {
    console.log('❌ Next.js 依赖未安装');
  }
} catch (error) {
  console.log('❌ package.json 解析失败:', error.message);
}

console.log('');

// 检查 Dockerfile
console.log('🐳 检查 Dockerfile...');
if (fs.existsSync('Dockerfile')) {
  const dockerfileContent = fs.readFileSync('Dockerfile', 'utf8');
  
  if (dockerfileContent.includes('FROM node')) {
    console.log('✅ 基础镜像配置正确');
  } else {
    console.log('❌ 基础镜像配置错误');
  }
  
  if (dockerfileContent.includes('EXPOSE 3000')) {
    console.log('✅ 端口配置正确');
  } else {
    console.log('❌ 端口配置错误');
  }
  
  if (dockerfileContent.includes('npm run build')) {
    console.log('✅ 构建命令配置正确');
  } else {
    console.log('❌ 构建命令配置错误');
  }
}

console.log('');

// 生成修复建议
console.log('🔧 修复建议:');
console.log('');

if (!allFilesExist) {
  console.log('1. 缺失文件修复:');
  console.log('   - 确保所有必要文件都存在');
  console.log('   - 重新运行 npm install');
  console.log('');
}

if (!fs.existsSync('.env.local')) {
  console.log('2. 环境变量配置:');
  console.log('   创建 .env.local 文件，内容如下:');
  console.log('');
  console.log('   # Azure OpenAI 配置');
  console.log('   AZURE_OPENAI_BASE_URL=https://gpt-i18n.byteintl.net/gpt/openapi/online/v2/crawl/openai/deployments/gpt_openapi');
  console.log('   AZURE_OPENAI_API_VERSION=2024-03-01-preview');
  console.log('   AZURE_OPENAI_API_KEY=I2brwSdmty3dYeCtPIderK1lJzrIHYcc_GPT_AK');
  console.log('   AZURE_OPENAI_MODEL_NAME=gemini-2.5-pro');
  console.log('   AZURE_OPENAI_MAX_TOKENS=32000');
  console.log('');
  console.log('   # 微信公众号配置');
  console.log('   WECHAT_APP_ID=wxc66e3754c009becc');
  console.log('   WECHAT_APP_SECRET=您的开发者密码');
  console.log('');
}

console.log('3. 微信公众号配置:');
console.log('   - 登录微信公众平台: https://mp.weixin.qq.com/');
console.log('   - 进入"开发" -> "基本配置"');
console.log('   - 获取开发者密码');
console.log('   - 配置IP白名单');
console.log('');

console.log('4. 部署步骤:');
console.log('   - 登录微信云托管: https://cloud.weixin.qq.com/');
console.log('   - 选择 Express.js 模板');
console.log('   - 上传 wechat-ai-workflow-deploy.zip');
console.log('   - 配置环境变量');
console.log('   - 设置端口为 3000');
console.log('   - 部署服务');
console.log('');

console.log('5. 测试部署:');
console.log('   - 访问部署后的域名');
console.log('   - 测试文章生成功能');
console.log('   - 测试排版功能');
console.log('   - 测试发布功能');
console.log('');

console.log('📖 详细文档:');
console.log('   - 部署指南: DEPLOYMENT.md');
console.log('   - 微信配置: WECHAT_SETUP.md');
console.log('   - 快速部署: ./deploy.sh'); 