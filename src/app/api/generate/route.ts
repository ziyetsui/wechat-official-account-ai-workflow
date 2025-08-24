import { NextRequest, NextResponse } from 'next/server'
import { generateContent, generateTitle, generateImageSuggestions } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const { topic, type, settings } = await request.json()

    if (!topic || !type) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
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
          { error: '不支持的类型' },
          { status: 400 }
        )
    }

    return NextResponse.json({ 
      success: true, 
      data: result,
      type 
    })

  } catch (error) {
    console.error('API错误:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : '服务器内部错误',
        success: false 
      },
      { status: 500 }
    )
  }
} 