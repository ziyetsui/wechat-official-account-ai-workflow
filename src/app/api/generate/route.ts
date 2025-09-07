import { NextRequest, NextResponse } from 'next/server'

// 使用ChatAI API的调用函数
async function safeApiCall(prompt: string, maxTokens: number = 2000) {
  const apiKey = process.env.CHATA_API_KEY || "sk-2dFvkITb1mr3yG7FdIYkc62mZPZKMSIsvdU0dLKaiyduuO3B"
  const baseUrl = process.env.CHATA_BASE_URL || "https://www.chataiapi.com/v1"
  const modelName = process.env.CHATA_MODEL_NAME || "gpt-3.5-turbo"
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000) // 15秒超时
  
  try {
    console.log('发起ChatAI API请求:', {
      baseUrl,
      modelName,
      maxTokens,
      promptLength: prompt.length
    })
    
    const requestBody = {
      model: modelName,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: maxTokens,
      temperature: 0.7
    }
    
    console.log('请求体:', JSON.stringify(requestBody, null, 2))
    
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok) {
      const data = await response.json()
      console.log('ChatAI API响应成功:', {
        status: response.status,
        model: data.model,
        usage: data.usage,
        hasChoices: !!data.choices,
        choiceCount: data.choices?.length || 0
      })
      
      return {
        success: true,
        data,
        status: response.status
      }
    } else {
      const errorText = await response.text()
      console.error('ChatAI API响应失败:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      })
      
      return {
        success: false,
        error: `${response.status} ${response.statusText}`,
        details: errorText,
        status: response.status
      }
    }
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('ChatAI API请求超时')
        return {
          success: false,
          error: '请求超时',
          details: 'API调用超过15秒未响应，请稍后重试'
        }
      }
      console.error('ChatAI API请求异常:', error.message)
      return {
        success: false,
        error: error.message,
        details: error.stack
      }
    }
    
    console.error('未知错误:', error)
    return {
      success: false,
      error: '未知错误',
      details: String(error)
    }
  }
}

// 调用ChatAI API
async function callChatAI(prompt: string, maxTokens: number = 2000) {
  const result = await safeApiCall(prompt, maxTokens)
  
  if (!result.success) {
    throw new Error(`ChatAI API调用失败: ${result.error} - ${result.details}`)
  }

  console.log('ChatAI响应:', { success: true, model: result.data.model })
  
  // 检查响应结构
  const choice = result.data.choices?.[0]
  if (choice?.message?.content) {
    const content = choice.message.content
    console.log('API返回内容长度:', content.length)
    console.log('API返回内容预览:', content.substring(0, 200))
    return content
  } else if (choice?.finish_reason === 'length') {
    console.warn('API响应被截断，finish_reason:', choice.finish_reason)
    throw new Error('生成内容被截断（达到最大token限制），请尝试减少输入长度或增加max_tokens')
  } else {
    console.error('API响应结构异常:', JSON.stringify(result.data, null, 2))
    throw new Error('生成失败：API响应格式异常')
  }
}

// 简化的生成函数
async function generateContent(topic: string, settings?: any): Promise<string> {
  const prompt = `请为关于"${topic}"的微信公众号文章生成一篇500-800字的文章，要求：
1. 文章要有吸引力，能引起读者兴趣
2. 结构清晰，逻辑严密
3. 语言生动，易于理解

请直接输出文章内容，不需要任何说明或标题。`

  return await callChatAI(prompt, 2000)
}

async function generateTitle(topic: string): Promise<string> {
  const prompt = `请为关于"${topic}"的微信公众号文章生成5个吸引人的标题，要求：
1. 标题要有吸引力，能引起读者兴趣
2. 长度适中，适合微信公众号显示

请直接输出标题，每行一个。`

  return await callChatAI(prompt, 300)
}

async function generateOutline(topic: string): Promise<string> {
  const prompt = `请为关于"${topic}"的微信公众号文章生成一个详细的大纲，要求：
1. 包含引言、主体、结论
2. 主体部分至少3个要点
3. 每个要点有简要说明

请直接输出大纲内容。`

  return await callChatAI(prompt, 800)
}

export async function POST(request: NextRequest) {
  try {
    const { topic, type = 'content', settings } = await request.json()

    if (!topic) {
      return NextResponse.json({ 
        success: false, 
        error: 'Topic is required' 
      }, { status: 400 })
    }

    console.log('收到生成请求:', { topic, type })

    let result: string

    try {
      console.log('开始调用ChatAI API生成内容...')
      
      if (type === 'content') {
        result = await generateContent(topic, settings)
      } else if (type === 'title') {
        result = await generateTitle(topic)
      } else if (type === 'outline') {
        result = await generateOutline(topic)
      } else {
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid type. Must be content, title, or outline' 
        }, { status: 400 })
      }

      console.log('ChatAI API生成成功，返回内容长度:', result.length)
      return NextResponse.json({ 
        success: true, 
        data: result,
        type: type
      })

    } catch (apiError) {
      console.error('ChatAI API调用失败，错误详情:', apiError)
      
      // 提供备用内容
      let fallbackContent = ''
      if (type === 'content') {
        fallbackContent = `关于"${topic}"的文章

这是一篇关于${topic}的文章。由于AI服务暂时不可用，我们为您提供了一个基础框架。

引言：
${topic}是一个重要的话题，值得我们深入探讨。

主体：
1. ${topic}的基本概念
2. ${topic}的重要性
3. ${topic}的应用场景

结论：
通过本文的讨论，我们可以看到${topic}的重要性和价值。希望这篇文章能为您提供一些有用的信息。

感谢您的阅读！`
      } else if (type === 'title') {
        fallbackContent = `关于${topic}的精彩文章
${topic}：你不知道的秘密
深度解析${topic}
${topic}的完整指南
${topic}：从入门到精通`
      } else if (type === 'outline') {
        fallbackContent = `关于"${topic}"的文章大纲

一、引言
- 话题引入
- 问题提出

二、主体
1. ${topic}的基本概念
2. ${topic}的重要性分析
3. ${topic}的实际应用

三、结论
- 总结要点
- 展望未来`
      }

      return NextResponse.json({ 
        success: true, 
        data: fallbackContent,
        type: type,
        warning: '使用了备用内容，建议稍后重试'
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