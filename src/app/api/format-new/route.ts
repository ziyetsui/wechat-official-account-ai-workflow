import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { article } = await request.json()

    if (!article || typeof article !== 'string') {
      return NextResponse.json({ 
        success: false, 
        error: 'Article content is required' 
      }, { status: 400 })
    }

    if (article.trim().length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Article content cannot be empty' 
      }, { status: 400 })
    }

    console.log('收到排版请求:', { articleLength: article.length })

    // 设置超时控制，最多 15 秒
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000) // 15 秒

    try {
      const prompt = `请将以下文章转换为HTML格式，要求：
1. 使用HTML格式，添加适当的样式
2. 保持原文内容不变
3. 添加合适的标题、段落、强调等HTML标签
4. 使用内联样式，确保在微信公众号中正常显示
5. 添加适当的颜色和字体样式

文章内容：
${article}

请直接输出HTML代码，不要包含任何说明文字。`

      // 发起 API 请求
      const response = await fetch('https://www.chataiapi.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-2dFvkITb1mr3yG7FdIYkc62mZPZKMSIsvdU0dLKaiyduuO3B'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.3
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
        let content = '排版失败'

        if (choice?.message?.content) {
          content = choice.message.content
          
          // 检查是否包含HTML标签
          if (!content.includes('<') || !content.includes('>')) {
            console.warn('API返回内容不包含HTML标签，使用备用方案')
            throw new Error('API返回内容格式不正确')
          }
        } else if (choice?.finish_reason === 'length') {
          content = '排版内容被截断（达到最大token限制），请尝试减少输入长度'
        } else if (choice?.finish_reason) {
          content = `排版完成，原因：${choice.finish_reason}`
        }

        return NextResponse.json({ 
          success: true, 
          data: content,
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
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
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
        console.warn('API调用失败，使用备用方案:', error.message)
      }

      // 备用方案：返回基础HTML格式
      const fallbackContent = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 24px;">📝 文章内容</h2>
    <div style="white-space: pre-wrap; font-size: 16px; line-height: 1.8;">${article}</div>
  </div>
  
  <div style="background: #e8f4fd; padding: 15px; border-radius: 6px; border-left: 4px solid #3498db;">
    <p style="margin: 0; color: #2980b9; font-size: 14px;">
      <strong>💡 提示：</strong>由于API服务暂时不可用，已为您提供基础排版格式。您可以复制此内容到公众号编辑器中进行进一步美化。
    </p>
  </div>
</div>`

      return NextResponse.json({ 
        success: true, 
        data: fallbackContent,
        warning: '使用了备用排版方案，建议手动优化格式'
      })
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
