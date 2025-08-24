import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { FORMATTING_PROMPT_TEMPLATE } from '@/lib/format-prompts'

export async function POST(request: NextRequest) {
  try {
    const { article } = await request.json()

    if (!article) {
      return NextResponse.json(
        { error: '缺少文章内容' },
        { status: 400 }
      )
    }

    const prompt = FORMATTING_PROMPT_TEMPLATE.replace('{{article}}', article)

    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_MODEL_NAME || "gemini-2.5-pro",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: parseInt(process.env.AZURE_OPENAI_MAX_TOKENS || "32000"),
      temperature: 0.3, // 降低温度以获得更一致的排版结果
    })

    const formattedContent = response.choices[0]?.message?.content || '排版失败，请重试'

    return NextResponse.json({ 
      success: true, 
      data: formattedContent
    })

  } catch (error) {
    console.error('排版API错误:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : '排版失败，请稍后重试',
        success: false 
      },
      { status: 500 }
    )
  }
} 