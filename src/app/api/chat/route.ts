import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // 获取请求方法（仅接受 POST）
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
  }

  try {
    // 获取请求体内容
    const { message, model = 'gpt-3.5-turbo', max_tokens = 1000 } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    console.log('收到聊天请求:', { 
      messageLength: message.length, 
      model, 
      max_tokens 
    })

    // 设置超时控制，最多 15 秒
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000) // 15 秒

    try {
      // 发起 API 请求到ChatAI API服务
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
              content: message
            }
          ],
          max_tokens: max_tokens,
          temperature: 0.7
        }),
        signal: controller.signal, // 传入超时控制信号
      })

      // 检查 API 响应
      if (!response.ok) {
        const errorText = await response.text()
        console.error('ChatAI API请求失败:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        })
        throw new Error(`API request failed with status ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log('ChatAI API响应成功:', {
        status: response.status,
        model: data.model,
        usage: data.usage
      })
      
      // 处理响应数据
      const choice = data.choices?.[0]
      let content = '抱歉，我无法生成回复。'
      
      if (choice?.message?.content) {
        content = choice.message.content
      } else if (choice?.finish_reason === 'length') {
        content = '回复被截断（达到最大token限制），请尝试更简短的问题。'
      } else if (choice?.finish_reason) {
        content = `回复完成，原因：${choice.finish_reason}`
      }
      
      // 返回 API 数据
      return NextResponse.json({
        success: true,
        message: content,
        usage: data.usage,
        model: data.model,
        id: data.id
      })
      
    } catch (error) {
      console.error('Error during ChatAI API request:', error)

      // 处理超时错误
      if (error instanceof Error && error.name === 'AbortError') {
        return NextResponse.json({ 
          success: false,
          error: 'Request Timeout',
          message: '请求超时，请稍后重试'
        }, { status: 504 })
      }

      // 其他错误处理
      return NextResponse.json({ 
        success: false,
        error: 'Internal Server Error', 
        message: error instanceof Error ? error.message : '服务器内部错误'
      }, { status: 500 })
    } finally {
      clearTimeout(timeout) // 清理超时计时器
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