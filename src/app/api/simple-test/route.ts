import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('=== 简单测试 API 开始 ===')
    
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyAjVdNMbHndiBgWv-dvDPIcsJ2OQFDu6ug"
    const baseUrl = process.env.GEMINI_BASE_URL || 'https://api.246520.xyz'
    const modelName = process.env.GEMINI_MODEL_NAME || 'gemini-2.5-pro'
    
    console.log('API 配置:', {
      baseUrl,
      modelName,
      hasApiKey: !!apiKey
    })
    
    // 简单的 API 调用测试
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10秒超时
    
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
                  text: "请简单回复：测试成功"
                }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 50,
            temperature: 0.3,
          }
        }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data = await response.json()
        console.log('API 响应数据:', JSON.stringify(data, null, 2))
        
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '无响应内容'
        
        console.log('API 调用成功:', { success: true, content })
        
        return NextResponse.json({
          success: true,
          message: 'API 配置正确',
          config: {
            baseUrl,
            modelName,
            hasApiKey: !!apiKey
          },
          response: content,
          rawData: data
        })
      } else {
        const errorText = await response.text()
        console.error('API 调用失败:', response.status, errorText)
        
        return NextResponse.json({
          success: false,
          error: `API调用失败: ${response.status} ${response.statusText}`,
          details: errorText
        }, { status: 500 })
      }
      
    } catch (error) {
      clearTimeout(timeoutId)
      
      console.error('API 调用异常:', error)
      
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'API调用异常',
        config: {
          baseUrl,
          modelName,
          hasApiKey: !!apiKey
        }
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('=== 简单测试 API 异常 ===')
    console.error('错误详情:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '服务器内部错误'
    }, { status: 500 })
  }
}