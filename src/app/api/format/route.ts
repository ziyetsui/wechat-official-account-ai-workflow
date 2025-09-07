import { NextRequest, NextResponse } from 'next/server'
import { FORMATTING_PROMPT_TEMPLATE } from '@/lib/format-prompts'

// 直接调用Azure OpenAI API的函数
async function callAzureOpenAI(prompt: string, maxTokens: number = 16000) {
  // 使用环境变量或默认配置
  const base_url = process.env.AZURE_OPENAI_BASE_URL || process.env.GEMINI_BASE_URL || "https://gpt-i18n.byteintl.net/gpt/openapi/online/v2/crawl/openapi/deployments/gpt_openapi"
  const api_version = process.env.AZURE_OPENAI_API_VERSION || "2024-03-01-preview"
  const ak = process.env.AZURE_OPENAI_API_KEY || process.env.GEMINI_API_KEY || "I2brwSdmty3dYeCtPIderK1lJzrIHYcc_GPT_AK"
  const model_name = process.env.AZURE_OPENAI_MODEL_NAME || "gemini-2.5-pro"
  
  console.log('Format API 配置:', {
    base_url: base_url.substring(0, 50) + '...',
    api_version,
    has_api_key: !!ak,
    model_name
  })

  const apiUrl = `${base_url}/chat/completions?api-version=${api_version}`
  
  // 添加超时控制
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000) // 30秒超时
  
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
        temperature: 0.3,
        stream: false, // 确保不使用流式响应
      }),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API调用失败: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || '排版失败'
    
    // 检查是否因为token限制而被截断
    if (data.choices?.[0]?.finish_reason === 'length') {
      console.warn('警告：响应因token限制被截断，可能需要增加max_tokens')
    }
    
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
    console.log('- 内容长度:', content.length)
    
    // 如果HTML不完整，尝试修复
    if (hasOpeningDiv && !hasClosingDiv) {
      console.warn('检测到不完整的HTML，尝试修复...')
      const fixedContent = content + '\n</div>'
      console.log('已添加结束div标签')
      return fixedContent
    }
    
    return content
    
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

    // 临时解决方案：如果API调用失败，返回一个基本的格式化结果
    try {
      const prompt = FORMATTING_PROMPT_TEMPLATE.replace('{{article}}', article)
      const formattedContent = await callAzureOpenAI(prompt, 16000)
      
      return NextResponse.json({ 
        success: true, 
        data: formattedContent
      })
    } catch (apiError) {
      console.warn('API调用失败，使用备用方案:', apiError)
      
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

