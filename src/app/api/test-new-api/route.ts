import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const apiKey = "sk-hdkashjdaskjdhaskjdaskjjsksa"
  const baseUrl = "https://www.chataiapi.com/v1"
  
  console.log('测试新的 API 配置:', { baseUrl, hasApiKey: !!apiKey })

  // 设置超时控制，最多 10 秒
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    // 测试不同的模型
    const models = ['gpt-3.5-turbo', 'gpt-4', 'claude-3-sonnet', 'gemini-pro']
    
    for (const model of models) {
      try {
        console.log(`测试模型: ${model}`)
        
        const response = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: '你好' }],
            max_tokens: 50
          }),
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (response.ok) {
          const data = await response.json()
          console.log(`模型 ${model} 测试成功:`, data)
          
          return NextResponse.json({
            success: true,
            message: '新 API 配置正确',
            config: { baseUrl, model, hasApiKey: !!apiKey },
            response: data.choices?.[0]?.message?.content || '无响应内容',
            rawData: data
          })
        } else {
          const errorText = await response.text()
          console.log(`模型 ${model} 测试失败:`, response.status, errorText)
          
          if (response.status === 401) {
            return NextResponse.json({
              success: false,
              message: `API Key 无效 (模型: ${model})`,
              error: errorText,
              config: { baseUrl, model, hasApiKey: !!apiKey }
            }, { status: 401 })
          }
        }
      } catch (error) {
        console.log(`模型 ${model} 请求异常:`, error)
      }
    }
    
    return NextResponse.json({
      success: false,
      message: '所有模型测试都失败',
      config: { baseUrl, hasApiKey: !!apiKey }
    }, { status: 500 })
    
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('API 请求超时')
      return NextResponse.json({
        success: false,
        message: '请求超时',
        error: 'API调用超过10秒未响应'
      }, { status: 504 })
    }
    
    console.error('API 请求异常:', error)
    return NextResponse.json({
      success: false,
      message: 'API 请求异常',
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}
