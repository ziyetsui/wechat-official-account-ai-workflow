import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { topic, type = 'content', model = 'gpt-3.5-turbo' } = await request.json()

    if (!topic) {
      return NextResponse.json({ 
        success: false, 
        error: 'Topic is required' 
      }, { status: 400 })
    }

    console.log('收到生成请求:', { topic, type, model })

    // 设置超时控制，最多 15 秒
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000) // 15 秒

    try {
      let prompt = ''
      let maxTokens = 1000

      if (type === 'content') {
        prompt = `请为关于"${topic}"的微信公众号文章生成一篇500-800字的文章，要求：
1. 文章要有吸引力，能引起读者兴趣
2. 结构清晰，逻辑严密
3. 语言生动，易于理解

请直接输出文章内容，不需要任何说明或标题。`
        maxTokens = 1500
      } else if (type === 'title') {
        prompt = `请为关于"${topic}"的微信公众号文章生成5个吸引人的标题，要求：
1. 标题要有吸引力，能引起读者兴趣
2. 长度适中，适合微信公众号显示

请直接输出标题，每行一个。`
        maxTokens = 200
      } else if (type === 'outline') {
        prompt = `请为关于"${topic}"的微信公众号文章生成一个详细的大纲，要求：
1. 包含引言、主体、结论
2. 主体部分至少3个要点
3. 每个要点有简要说明

请直接输出大纲内容。`
        maxTokens = 500
      }

      // 发起 API 请求
      const response = await fetch('https://www.chataiapi.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-2dFvkITb1mr3yG7FdIYkc62mZPZKMSIsvdU0dLKaiyduuO3B'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: maxTokens,
          temperature: 0.7
        }),
        signal: controller.signal
      })

      clearTimeout(timeout)

      if (response.ok) {
        const data = await response.json()
        console.log('API响应成功:', {
          status: response.status,
          model: data.model,
          usage: data.usage
        })

        const choice = data.choices?.[0]
        let content = '生成失败'

        if (choice?.message?.content) {
          content = choice.message.content
        } else if (choice?.finish_reason === 'length') {
          content = '生成内容被截断（达到最大token限制），请尝试减少输入长度'
        } else if (choice?.finish_reason) {
          content = `生成完成，原因：${choice.finish_reason}`
        }

        return NextResponse.json({
          success: true,
          data: content,
          type: type,
          usage: data.usage,
          model: data.model
        })
      } else {
        const errorText = await response.text()
        console.error('API响应失败:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        })

        return NextResponse.json({
          success: false,
          error: `${response.status} ${response.statusText}`,
          details: errorText
        }, { status: response.status })
      }

    } catch (error) {
      clearTimeout(timeout)

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error('API请求超时')
          return NextResponse.json({
            success: false,
            error: '请求超时',
            details: 'API调用超过15秒未响应，请稍后重试'
          }, { status: 504 })
        }
        console.error('API请求异常:', error.message)
        return NextResponse.json({
          success: false,
          error: error.message,
          details: error.stack
        }, { status: 500 })
      }

      console.error('未知错误:', error)
      return NextResponse.json({
        success: false,
        error: '未知错误',
        details: String(error)
      }, { status: 500 })
    }

  } catch (error) {
    console.error('请求处理异常:', error)
    return NextResponse.json({
      success: false,
      error: 'Bad Request',
      message: '请求格式错误'
    }, { status: 400 })
  }
}
