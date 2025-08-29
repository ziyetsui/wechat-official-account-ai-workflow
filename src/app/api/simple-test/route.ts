import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 设置CORS头
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    const base_url = process.env.AZURE_OPENAI_BASE_URL
    const api_version = process.env.AZURE_OPENAI_API_VERSION
    const ak = process.env.AZURE_OPENAI_API_KEY
    const model_name = process.env.AZURE_OPENAI_MODEL_NAME

    // 检查环境变量
    if (!base_url || !api_version || !ak || !model_name) {
      return NextResponse.json({
        success: false,
        error: '环境变量未配置',
        env: {
          base_url: !!base_url,
          api_version: !!api_version,
          ak: !!ak,
          model_name: !!model_name
        }
      }, { status: 500, headers })
    }

    const apiUrl = `${base_url}/chat/completions?api-version=${api_version}`
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': ak,
      },
      body: JSON.stringify({
        model: model_name,
        messages: [
          {
            role: "user",
            content: "请回复'测试成功'"
          }
        ],
        max_tokens: 100,
        temperature: 0.1,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({
        success: false,
        error: `API调用失败: ${response.status}`,
        details: errorText
      }, { status: 500, headers })
    }

    const data = await response.json()
    const result = data.choices?.[0]?.message?.content || '无响应'
    
    return NextResponse.json({ 
      success: true, 
      message: 'API测试成功',
      result,
      timestamp: new Date().toISOString()
    }, { headers })

  } catch (error) {
    console.error('简单测试错误:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : '服务器内部错误',
        message: '测试失败',
        timestamp: new Date().toISOString()
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

