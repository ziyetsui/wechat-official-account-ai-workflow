
import { NextRequest, NextResponse } from 'next/server'

// 环境变量检查函数
function checkEnvironmentVariables() {
  const requiredVars = [
    'GEMINI_API_KEY',
    'GEMINI_BASE_URL'
  ]
  
  const missingVars = requiredVars.filter(varName => !process.env[varName])
  
  return {
    allConfigured: missingVars.length === 0,
    missing: missingVars,
    configured: requiredVars.reduce((acc, varName) => {
      acc[varName] = process.env[varName] ? '已配置' : '未配置'
      return acc
    }, {} as Record<string, string>)
  }
}

// 安全的API调用函数
async function safeApiCall(prompt: string, maxTokens: number = 2000) {
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyAjVdNMbHndiBgWv-dvDPIcsJ2OQFDu6ug"
  const baseUrl = process.env.GEMINI_BASE_URL || 'https://api.246520.xyz'
  const modelName = process.env.GEMINI_MODEL_NAME || 'gemini-2.5-pro'
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000) // 30秒超时
  
  try {
    const response = await fetch(`${baseUrl}/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.7,
        }
      }),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok) {
      const data = await response.json()
      return {
        success: true,
        data,
        status: response.status
      }
    } else {
      const errorText = await response.text()
      return {
        success: false,
        error: `${response.status} ${response.statusText}`,
        details: errorText,
        status: response.status
      }
    }
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: '请求超时',
          details: 'API调用超过30秒未响应'
        }
      }
      return {
        success: false,
        error: error.message,
        details: error.stack
      }
    }
    
    return {
      success: false,
      error: '未知错误',
      details: String(error)
    }
  }
}

// 直接调用Gemini API的函数
async function callGemini(prompt: string, maxTokens: number = 2000) {
  const baseUrl = process.env.GEMINI_BASE_URL || 'https://api.246520.xyz'
  const modelName = process.env.GEMINI_MODEL_NAME || 'gemini-2.5-pro'

  console.log('Gemini配置:', {
    baseUrl,
    modelName,
    hasApiKey: !!process.env.GEMINI_API_KEY
  })

  const result = await safeApiCall(prompt, maxTokens)
  
  if (!result.success) {
    console.error('Gemini API错误:', result)
    throw new Error(`Gemini API调用失败: ${result.error} - ${result.details}`)
  }

  console.log('Gemini响应:', { success: true, model: modelName })
  return result.data.candidates?.[0]?.content?.parts?.[0]?.text || '生成失败'
}

// 简化的生成函数
async function generateContent(topic: string, settings?: any): Promise<string> {
  const prompt = `请为关于"${topic}"的微信公众号文章生成一篇3000-4000字的文章，要求：
1. 文章要有吸引力，能引起读者兴趣
2. 符合刘润老师的文风特点
3. 包含实际案例和深入分析
4. 结构清晰，逻辑严密
5. 语言生动，易于理解

请直接输出文章内容，不需要任何说明或标题。`

  return await callGemini(prompt, 4000)
}

async function generateTitle(topic: string): Promise<string> {
  const prompt = `请为关于"${topic}"的微信公众号文章生成5个吸引人的标题，要求：
1. 标题要有吸引力，能引起读者兴趣
2. 长度适中，适合微信公众号显示
3. 包含关键词，有利于SEO
4. 风格多样，有疑问式、数字式、情感式等
5. 符合刘润老师的文风特点

请直接输出5个标题，每行一个，不需要编号。`

  return await callGemini(prompt, 1000)
}

async function generateImageSuggestions(content: string): Promise<string> {
  const prompt = `为以下微信公众号文章内容推荐3-5张配图建议：

${content.substring(0, 500)}...

请提供具体的配图建议，包括：
1. 图片类型（如：插图、照片、图表等）
2. 图片内容描述
3. 图片风格建议
4. 放置位置建议

请用简洁的语言描述，每张图片建议用一行表示。`

  return await callGemini(prompt, 800)
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== 内容生成API开始 ===')
    
    // 设置CORS头
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    const { topic, type, settings } = await request.json()
    console.log('接收到的参数:', { topic, type, settings })

    if (!topic || !type) {
      console.error('缺少必要参数:', { topic, type })
      return NextResponse.json(
        { 
          success: false,
          error: '缺少必要参数',
          message: '请提供topic和type参数'
        },
        { status: 400, headers }
      )
    }

    // 检查环境变量
    const envCheck = checkEnvironmentVariables()
    if (!envCheck.allConfigured) {
      console.error('环境变量配置不完整:', envCheck.missing)
      return NextResponse.json(
        { 
          success: false,
          error: '环境变量配置不完整',
          missing: envCheck.missing,
          configured: envCheck.configured
        },
        { status: 500, headers }
      )
    }

    let result: string

    switch (type) {
      case 'content':
        console.log('开始生成文章内容...')
        result = await generateContent(topic, settings)
        break
      case 'title':
        console.log('开始生成标题...')
        result = await generateTitle(topic)
        break
      case 'images':
        console.log('开始生成配图建议...')
        result = await generateImageSuggestions(topic)
        break
      default:
        console.error('不支持的类型:', type)
        return NextResponse.json(
          { 
            success: false,
            error: '不支持的类型',
            message: 'type参数必须是content、title或images之一'
          },
          { status: 400, headers }
        )
    }

    console.log('=== 内容生成API完成 ===')
    return NextResponse.json({ 
      success: true, 
      data: result,
      type 
    }, { headers })

  } catch (error) {
    console.error('=== 内容生成API异常 ===')
    console.error('错误详情:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : '服务器内部错误',
        message: '服务器处理请求时发生错误',
        stack: error instanceof Error ? error.stack : undefined
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    )
  }
} 