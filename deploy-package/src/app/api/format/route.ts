import { NextRequest, NextResponse } from 'next/server'
import { FORMATTING_PROMPT_TEMPLATE } from '@/lib/format-prompts'

// 直接调用Azure OpenAI API的函数
async function callAzureOpenAI(prompt: string, maxTokens: number = 4000) {
  const base_url = process.env.AZURE_OPENAI_BASE_URL || "https://gpt-i18n.byteintl.net/gpt/openapi/online/v2/crawl/openai/deployments/gpt_openapi"
  const api_version = process.env.AZURE_OPENAI_API_VERSION || "2024-03-01-preview"
  const ak = process.env.AZURE_OPENAI_API_KEY || "I2brwSdmty3dYeCtPIderK1lJzrIHYcc_GPT_AK"
  const model_name = process.env.AZURE_OPENAI_MODEL_NAME || "gemini-2.5-pro"

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
          content: prompt
        }
      ],
      max_tokens: maxTokens,
      temperature: 0.3,
    }),
  })

  if (!response.ok) {
    throw new Error(`API调用失败: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || '排版失败'
}

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

    const formattedContent = await callAzureOpenAI(prompt, 4000)

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

