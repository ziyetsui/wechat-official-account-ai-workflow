import { NextRequest, NextResponse } from 'next/server'

// 支持多种 API 配置
const API_CONFIGS = [
  {
    name: 'ChatAI API',
    baseUrl: 'https://www.chataiapi.com/v1',
    apiKey: 'sk-hdkashjdaskjdhaskjdaskjjsksa',
    models: ['gpt-3.5-turbo', 'gpt-4', 'claude-3-sonnet'],
    endpoint: '/chat/completions'
  },
  {
    name: 'Gemini API',
    baseUrl: 'https://api.246520.xyz',
    apiKey: 'AIzaSyAjVdNMbHndiBgWv-dvDPIcsJ2OQFDu6ug',
    models: ['gemini-2.5-pro'],
    endpoint: '/v1beta/models/gemini-2.5-pro:generateContent'
  }
]

async function callChatAI(prompt: string, config: any) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)
  
  try {
    const response = await fetch(`${config.baseUrl}${config.endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.models[0],
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200
      }),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok) {
      const data = await response.json()
      return {
        success: true,
        content: data.choices?.[0]?.message?.content || '无响应内容',
        usage: data.usage,
        model: data.model
      }
    } else {
      const errorText = await response.text()
      return {
        success: false,
        error: `${response.status} ${response.statusText}`,
        details: errorText
      }
    }
  } catch (error) {
    clearTimeout(timeoutId)
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

async function callGemini(prompt: string, config: any) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)
  
  try {
    const response = await fetch(`${config.endpoint}?key=${config.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 200,
          temperature: 0.7
        }
      }),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok) {
      const data = await response.json()
      const candidate = data.candidates?.[0]
      let content = '无响应内容'
      
      if (candidate?.content?.parts?.[0]?.text) {
        content = candidate.content.parts[0].text
      } else if (candidate?.finishReason === 'MAX_TOKENS') {
        content = '回复被截断（达到最大token限制）'
      }
      
      return {
        success: true,
        content,
        usage: data.usageMetadata,
        model: data.modelVersion
      }
    } else {
      const errorText = await response.text()
      return {
        success: false,
        error: `${response.status} ${response.statusText}`,
        details: errorText
      }
    }
  } catch (error) {
    clearTimeout(timeoutId)
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

export async function POST(request: NextRequest) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
  }

  try {
    const { message, preferredApi } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    console.log('收到聊天请求:', { messageLength: message.length, preferredApi })

    // 按优先级尝试不同的 API
    const configsToTry = preferredApi 
      ? API_CONFIGS.filter(config => config.name === preferredApi)
      : API_CONFIGS

    for (const config of configsToTry) {
      console.log(`尝试使用 ${config.name}...`)
      
      let result
      if (config.name === 'Gemini API') {
        result = await callGemini(message, config)
      } else {
        result = await callChatAI(message, config)
      }
      
      if (result.success) {
        console.log(`${config.name} 调用成功`)
        return NextResponse.json({
          success: true,
          message: result.content,
          usage: result.usage,
          model: result.model,
          apiUsed: config.name
        })
      } else {
        console.log(`${config.name} 调用失败:`, result.error)
      }
    }
    
    // 所有 API 都失败
    return NextResponse.json({
      success: false,
      error: '所有 API 都不可用',
      message: '抱歉，所有 AI 服务都暂时不可用，请稍后重试'
    }, { status: 503 })

  } catch (error) {
    console.error('请求处理异常:', error)
    return NextResponse.json({
      success: false,
      error: 'Bad Request',
      message: '请求格式错误'
    }, { status: 400 })
  }
}
