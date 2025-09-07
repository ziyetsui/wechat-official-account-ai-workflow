import { NextRequest, NextResponse } from 'next/server'

// 使用ChatAI API的排版函数
async function callChatAIForFormat(prompt: string, maxTokens: number = 2000) {
  const apiKey = "sk-2dFvkITb1mr3yG7FdIYkc62mZPZKMSIsvdU0dLKaiyduuO3B"
  const baseUrl = "https://www.chataiapi.com/v1"
  const modelName = "gpt-3.5-turbo"
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000) // 15秒超时
  
  try {
    console.log('发起ChatAI API排版请求:', {
      baseUrl,
      modelName,
      maxTokens,
      promptLength: prompt.length
    })
    
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.3
      }),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok) {
      const data = await response.json()
      console.log('ChatAI API排版响应成功:', {
        status: response.status,
        model: data.model,
        usage: data.usage
      })
      
      // 检查响应结构
      const choice = data.choices?.[0]
      let content = '排版失败'
      
      if (choice?.message?.content) {
        content = choice.message.content
        
        // 检查是否包含HTML标签
        if (!content.includes('<') || !content.includes('>')) {
          console.warn('API返回内容不包含HTML标签')
          throw new Error('API返回内容格式不正确')
        }
      } else if (choice?.finish_reason === 'length') {
        content = '排版内容被截断（达到最大token限制），请尝试减少输入长度'
      } else if (choice?.finish_reason) {
        content = `排版完成，原因：${choice.finish_reason}`
      } else {
        console.error('API响应结构异常:', data)
        content = '排版失败：API响应格式异常'
      }
      
      // 检查HTML完整性
      if (content.includes('<') && content.includes('>')) {
        // 确保有基本的HTML结构
        if (!content.includes('<div') && !content.includes('<p') && !content.includes('<h')) {
          console.warn('HTML结构不完整，添加基础结构')
          content = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">${content}</div>`
        }
      }
      
      return content
    } else {
      const errorText = await response.text()
      console.error('ChatAI API排版响应失败:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      })
      throw new Error(`ChatAI API调用失败: ${response.status} ${response.statusText} - ${errorText}`)
    }
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('ChatAI API排版请求超时')
        throw new Error('请求超时 - API调用超过15秒未响应，请稍后重试')
      }
      console.error('ChatAI API排版请求异常:', error.message)
      throw error
    }
    
    console.error('未知错误:', error)
    throw new Error('未知错误: ' + String(error))
  }
}

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

      const formattedContent = await callChatAIForFormat(prompt, 2000)
      
      return NextResponse.json({ 
        success: true, 
        data: formattedContent
      })
    } catch (apiError) {
      console.warn('ChatAI API调用失败，使用备用方案:', apiError)
      
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