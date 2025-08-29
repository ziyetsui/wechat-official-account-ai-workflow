import { NextRequest, NextResponse } from 'next/server'

// 直接调用Azure OpenAI API的函数
async function callAzureOpenAI(prompt: string, maxTokens: number = 2000) {
  const base_url = process.env.AZURE_OPENAI_BASE_URL || "https://gpt-i18n.byteintl.net/gpt/openapi/online/v2/crawl/openai/deployments/gpt_openapi"
  const api_version = process.env.AZURE_OPENAI_API_VERSION || "2024-03-01-preview"
  const ak = process.env.AZURE_OPENAI_API_KEY || "I2brwSdmty3dYeCtPIderK1lJzrIHYcc_GPT_AK"
  const model_name = process.env.AZURE_OPENAI_MODEL_NAME || "gemini-2.5-pro"

  // 添加调试信息
  console.log('Azure OpenAI配置:', {
    base_url,
    api_version,
    model_name,
    hasApiKey: !!ak
  })

  const apiUrl = `${base_url}/chat/completions?api-version=${api_version}`
  
  try {
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
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Azure OpenAI API错误:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      })
      throw new Error(`Azure OpenAI API调用失败: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Azure OpenAI响应:', { success: true, model: data.model })
    return data.choices?.[0]?.message?.content || '生成失败'
  } catch (error) {
    console.error('Azure OpenAI调用异常:', error)
    throw error
  }
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

  return await callAzureOpenAI(prompt, 4000)
}

async function generateTitle(topic: string): Promise<string> {
  const prompt = `请为关于"${topic}"的微信公众号文章生成5个吸引人的标题，要求：
1. 标题要有吸引力，能引起读者兴趣
2. 长度适中，适合微信公众号显示
3. 包含关键词，有利于SEO
4. 风格多样，有疑问式、数字式、情感式等
5. 符合刘润老师的文风特点

请直接输出5个标题，每行一个，不需要编号。`

  return await callAzureOpenAI(prompt, 1000)
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

  return await callAzureOpenAI(prompt, 800)
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