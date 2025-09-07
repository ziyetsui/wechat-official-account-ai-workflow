import { NextRequest, NextResponse } from 'next/server'
import { FORMATTING_PROMPT_TEMPLATE } from '@/lib/format-prompts'

// 使用Gemini API进行排版（与generate API保持一致）
async function callGeminiForFormat(prompt: string, maxTokens: number = 8000) {
  const apiKey = process.env.GEMINI_API_KEY
  const baseUrl = process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com'
  const modelName = process.env.GEMINI_MODEL_NAME || 'gemini-2.5-pro-preview-05-06'
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY 环境变量未配置')
  }

  console.log('Format API Gemini配置:', {
    baseUrl,
    modelName,
    hasApiKey: !!apiKey,
    maxTokens
  })

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000) // 30秒超时
  
  try {
    const response = await fetch(`${baseUrl}/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.3,
        }
      }),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok) {
      const data = await response.json()
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '排版失败'
      
      console.log('Gemini Format API 响应成功，内容长度:', content.length)
      
      // 检查HTML完整性
      const hasOpeningDiv = content.includes('<div')
      const hasClosingDiv = content.includes('</div>')
      const hasOpeningP = content.includes('<p')
      const hasClosingP = content.includes('</p>')
      
      console.log('HTML完整性检查:')
      console.log('- 包含开始div标签:', hasOpeningDiv)
      console.log('- 包含结束div标签:', hasClosingDiv)
      console.log('- 包含开始p标签:', hasOpeningP)
      console.log('- 包含结束p标签:', hasClosingP)
      
      // 如果HTML不完整，尝试修复
      if (hasOpeningDiv && !hasClosingDiv) {
        console.warn('检测到不完整的HTML，尝试修复...')
        const fixedContent = content + '\n</div>'
        console.log('已添加结束div标签')
        return fixedContent
      }
      
      return content
    } else {
      const errorText = await response.text()
      throw new Error(`Gemini API调用失败: ${response.status} ${response.statusText} - ${errorText}`)
    }
    
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('API调用超时，请稍后重试')
      }
      throw error
    }
    
    throw new Error('API调用失败: ' + String(error))
  }
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

    console.log('Format API 调用开始，文章长度:', article.length)

    // 使用Gemini API进行排版
    try {
      // 使用简化的prompt模板
      const simplePrompt = `请将以下文章转换为公众号排版格式的HTML代码：

要求：
1. 使用HTML格式输出
2. 添加适当的标题样式（h1, h2等）
3. 设置合适的字体、颜色和间距
4. 保持原文内容不变
5. 使用内联CSS样式
6. 确保HTML标签正确闭合

文章内容：
${article}

请直接输出HTML代码，不要包含任何解释文字。`
      
      const formattedContent = await callGeminiForFormat(simplePrompt, 8000)
      
      return NextResponse.json({ 
        success: true, 
        data: formattedContent
      })
    } catch (apiError) {
      console.warn('Gemini API调用失败，使用备用方案:', apiError)
      
      // 备用方案：返回基本的HTML格式化
      const basicFormattedContent = `
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
        data: basicFormattedContent,
        warning: '使用了备用排版方案，建议手动优化格式'
      })
    }

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

