import OpenAI from 'openai'
import { PROFESSIONAL_PROMPT_TEMPLATE, TITLE_GENERATION_PROMPT, IMAGE_SUGGESTION_PROMPT } from './prompts'

const base_url = process.env.AZURE_OPENAI_BASE_URL || "https://gpt-i18n.byteintl.net/gpt/openapi/online/v2/crawl/openai/deployments/gpt_openapi"
const api_version = process.env.AZURE_OPENAI_API_VERSION || "2024-03-01-preview"
const ak = process.env.AZURE_OPENAI_API_KEY || "I2brwSdmty3dYeCtPIderK1lJzrIHYcc_GPT_AK"
const model_name = process.env.AZURE_OPENAI_MODEL_NAME || "gemini-2.5-pro"
const max_tokens = parseInt(process.env.AZURE_OPENAI_MAX_TOKENS || "32000")

// 创建Azure OpenAI客户端
export const openai = new OpenAI({
  baseURL: base_url,
  apiKey: ak,
  defaultQuery: { 'api-version': api_version },
  defaultHeaders: { 'api-key': ak },
})

// 使用专业提示词模板生成内容
export async function generateContent(topic: string, settings?: any): Promise<string> {
  try {
    let prompt = PROFESSIONAL_PROMPT_TEMPLATE
      .replace('{{material}}', topic)
      .replace('{{mainTitle}}', '')
      .replace('{{subTitle}}', '')

    // 如果提供了设置，则自定义提示词
    if (settings) {
      prompt = prompt
        .replace('产品经理、创业者、营销人员、对AIGC应用落地感兴趣的人', settings.targetAudience || '产品经理、创业者、营销人员、对AIGC应用落地感兴趣的人')
        .replace('3000-4000字', settings.contentLength || '3000-4000字')
        .replace('刘润风格', settings.writingStyle || '刘润风格')
    }

    const response = await openai.chat.completions.create({
      model: model_name,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: max_tokens,
      temperature: 0.7,
    })

    let content = response.choices[0]?.message?.content || '生成失败，请重试'
    
    // 清理内容，只保留文章部分
    content = cleanGeneratedContent(content)
    
    return content
  } catch (error) {
    console.error('API调用错误:', error)
    throw new Error('内容生成失败，请检查网络连接或稍后重试')
  }
}

// 清理生成的内容，移除提示词和说明
function cleanGeneratedContent(content: string): string {
  // 移除可能包含的提示词说明
  const lines = content.split('\n')
  const cleanedLines: string[] = []
  let isContentStarted = false
  let skipUntilContent = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()
    
    // 跳过空行
    if (!trimmedLine) {
      if (isContentStarted) {
        cleanedLines.push(line) // 保留内容中的空行
      }
      continue
    }
    
    // 检测提示词开始标记
    if (trimmedLine.includes('请根据以下素材生成内容：') ||
        trimmedLine.includes('素材：') ||
        trimmedLine.includes('初始化') ||
        trimmedLine.includes('角色（Role）') ||
        trimmedLine.includes('任务 (Task)') ||
        trimmedLine.includes('输出格式 (Format)') ||
        trimmedLine.includes('写作要求') ||
        trimmedLine.includes('模拟文风') ||
        trimmedLine.includes('限制') ||
        trimmedLine.includes('输出要求') ||
        trimmedLine.startsWith('<!--') ||
        trimmedLine.startsWith('-->') ||
        trimmedLine.startsWith('作者：') ||
        trimmedLine.startsWith('版本：') ||
        trimmedLine.startsWith('描述：') ||
        trimmedLine.startsWith('框架：') ||
        trimmedLine.startsWith('创建日期：') ||
        trimmedLine.startsWith('开源地址：') ||
        trimmedLine.includes('重要：请直接输出文章内容')) {
      skipUntilContent = true
      continue
    }
    
    // 检测文章内容开始标记
    if (trimmedLine.startsWith('#') || 
        trimmedLine.startsWith('##') || 
        trimmedLine.startsWith('###') ||
        trimmedLine.includes('钱，是这个世界上最便宜的东西') ||
        trimmedLine.includes('一个企业真正的利润') ||
        trimmedLine.includes('你和外界所有的合作') ||
        trimmedLine.includes('— 1 —') ||
        trimmedLine.includes('— 2 —') ||
        trimmedLine.includes('— 3 —') ||
        trimmedLine.includes('最后的话') ||
        trimmedLine.includes('最后的话')) {
      isContentStarted = true
      skipUntilContent = false
    }
    
    // 如果遇到明显的文章内容，开始保留
    if (trimmedLine.length > 10 && 
        !trimmedLine.includes('请') && 
        !trimmedLine.includes('要求') && 
        !trimmedLine.includes('输出') && 
        !trimmedLine.includes('格式') && 
        !trimmedLine.includes('角色') && 
        !trimmedLine.includes('任务') && 
        !trimmedLine.includes('限制') && 
        !trimmedLine.includes('重要：')) {
      isContentStarted = true
      skipUntilContent = false
    }
    
    // 如果内容已经开始且不需要跳过，保留这一行
    if (isContentStarted && !skipUntilContent) {
      cleanedLines.push(line)
    }
  }
  
  let result = cleanedLines.join('\n').trim()
  
  // 如果清理后内容太短，返回原始内容
  if (result.length < 100) {
    return content
  }
  
  return result
}

// 生成文章标题
export async function generateTitle(topic: string): Promise<string> {
  try {
    const prompt = TITLE_GENERATION_PROMPT.replace('{{topic}}', topic)

    const response = await openai.chat.completions.create({
      model: model_name,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.8,
    })

    return response.choices[0]?.message?.content || '标题生成失败'
  } catch (error) {
    console.error('标题生成错误:', error)
    throw new Error('标题生成失败')
  }
}

// 生成配图建议
export async function generateImageSuggestions(content: string): Promise<string> {
  try {
    const prompt = IMAGE_SUGGESTION_PROMPT.replace('{{content}}', content)

    const response = await openai.chat.completions.create({
      model: model_name,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.6,
    })

    return response.choices[0]?.message?.content || '配图建议生成失败'
  } catch (error) {
    console.error('配图建议生成错误:', error)
    throw new Error('配图建议生成失败')
  }
} 