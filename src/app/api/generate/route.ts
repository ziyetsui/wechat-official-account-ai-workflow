import { NextRequest, NextResponse } from 'next/server'
import { generateContent, generateTitle, generateImageSuggestions } from '@/lib/openai'

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
    // 设置CORS头
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    const { topic, type, settings } = await request.json()

    if (!topic || !type) {
      return NextResponse.json(
        { 
          success: false,
          error: '缺少必要参数',
          message: '请提供topic和type参数'
        },
        { status: 400, headers }
      )
    }

    let result: string

    switch (type) {
      case 'content':
        result = await generateContent(topic, settings)
        break
      case 'title':
        result = await generateTitle(topic)
        break
      case 'images':
        result = await generateImageSuggestions(topic)
        break
      default:
        return NextResponse.json(
          { 
            success: false,
            error: '不支持的类型',
            message: 'type参数必须是content、title或images之一'
          },
          { status: 400, headers }
        )
    }

    return NextResponse.json({ 
      success: true, 
      data: result,
      type 
    }, { headers })

  } catch (error) {
    console.error('API错误:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : '服务器内部错误',
        message: '服务器处理请求时发生错误'
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