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
async function safeApiCall(prompt: string, maxTokens: number = 1000) {
  const apiKey = process.env.GEMINI_API_KEY!
  const baseUrl = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com'
  const modelName = process.env.GEMINI_MODEL_NAME || 'gemini-2.0-flash-exp'
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000) // 15秒超时
  
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
          details: 'API调用超过15秒未响应'
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

export async function GET(request: NextRequest) {
  try {
    console.log('=== API连接测试开始 ===')
    console.log('环境:', process.env.NODE_ENV)
    console.log('时间:', new Date().toISOString())
    
    // 1. 检查环境变量
    const envCheck = checkEnvironmentVariables()
    console.log('环境变量检查:', envCheck)
    
    if (!envCheck.allConfigured) {
      console.error('缺少必需的环境变量:', envCheck.missing)
      return NextResponse.json({
        status: 'error',
        error: '环境变量配置不完整',
        missing: envCheck.missing,
        configured: envCheck.configured,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }
    
    // 2. 获取配置
    const apiKey = process.env.GEMINI_API_KEY!
    const baseUrl = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com'
    const modelName = process.env.GEMINI_MODEL_NAME || 'gemini-2.5-pro-preview-05-06'

    console.log('配置信息:', {
      baseUrl,
      modelName,
      hasApiKey: !!apiKey
    })

    // 3. 测试API连接
    const testPrompt = "请回复'Gemini 2.5 Pro API连接测试成功'"
    console.log('测试提示:', testPrompt)

    const apiTest = await safeApiCall(testPrompt, 50)
    console.log('API测试结果:', apiTest)

    // 4. 返回结果
    const result = {
      status: apiTest.success ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      envCheck,
      apiTest: {
        success: apiTest.success,
        response: apiTest.success ? apiTest.data.candidates?.[0]?.content?.parts?.[0]?.text : null,
        error: apiTest.success ? null : apiTest.error,
        details: apiTest.success ? null : apiTest.details,
        model: apiTest.success ? modelName : null
      },
      message: apiTest.success ? 'Gemini 2.5 Pro API连接测试成功' : 'Gemini 2.5 Pro API连接测试失败'
    }

    console.log('=== API连接测试完成 ===')
    return NextResponse.json(result, { 
      status: apiTest.success ? 200 : 500 
    })

  } catch (error) {
    console.error('=== API连接测试异常 ===')
    console.error('错误详情:', error)
    
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : '未知错误',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== POST API测试开始 ===')
    
    const { prompt = "请回复'POST测试成功'" } = await request.json()
    console.log('接收到的prompt:', prompt)
    
    // 检查环境变量
    const envCheck = checkEnvironmentVariables()
    if (!envCheck.allConfigured) {
      return NextResponse.json({
        success: false,
        error: '环境变量配置不完整',
        missing: envCheck.missing
      }, { status: 500 })
    }
    
    const apiTest = await safeApiCall(prompt, 200)
    
    if (apiTest.success) {
      return NextResponse.json({
        success: true,
        data: apiTest.data.candidates?.[0]?.content?.parts?.[0]?.text || '测试成功',
        model: process.env.GEMINI_MODEL_NAME || 'gemini-2.5-pro-preview-05-06'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: apiTest.error,
        details: apiTest.details
      }, { status: apiTest.status || 500 })
    }

  } catch (error) {
    console.error('=== POST API测试异常 ===')
    console.error('错误详情:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
