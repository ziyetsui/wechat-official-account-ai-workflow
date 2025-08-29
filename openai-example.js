// JavaScript版本的OpenAI API调用示例
// 对应Python代码:
// from openai import OpenAI
// client = OpenAI()
// response = client.responses.create(
//     model="gpt-5",
//     input="Write a short bedtime story about a unicorn."
// )
// print(response.output_text)

// 方法1: 使用fetch API (浏览器环境)
async function callOpenAIWithFetch() {
  const apiKey = process.env.OPENAI_API_KEY || 'your-api-key-here';
  const model = 'gpt-4'; // 或者 'gpt-3.5-turbo'
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: 'Write a short bedtime story about a unicorn.'
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Generated story:', data.choices[0].message.content);
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}

// 方法2: 使用Node.js环境 (需要安装openai包)
// npm install openai
async function callOpenAIWithNodeJS() {
  // 注意: 需要在Node.js环境中运行，并且安装openai包
  // const OpenAI = require('openai');
  // 或者使用ES6 import:
  // import OpenAI from 'openai';
  
  const OpenAI = require('openai');
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here',
  });

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: 'Write a short bedtime story about a unicorn.'
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    console.log('Generated story:', response.choices[0].message.content);
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}

// 方法3: 简化的fetch版本 (适用于我们的项目)
async function simpleOpenAICall(prompt, model = 'gpt-3.5-turbo') {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// 使用示例
async function example() {
  try {
    console.log('=== OpenAI API 调用示例 ===');
    
    // 使用简化的fetch版本
    const story = await simpleOpenAICall('Write a short bedtime story about a unicorn.');
    console.log('Generated story:');
    console.log(story);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// 如果在Node.js环境中运行
if (typeof window === 'undefined') {
  // Node.js环境
  example();
}

// 导出函数供其他模块使用
module.exports = {
  callOpenAIWithFetch,
  callOpenAIWithNodeJS,
  simpleOpenAICall,
  example
};

