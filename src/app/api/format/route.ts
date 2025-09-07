import { NextRequest, NextResponse } from 'next/server'

// 使用ChatAI API的排版函数
async function callChatAIForFormat(prompt: string, maxTokens: number = 2000) {
  const apiKey = process.env.CHATA_API_KEY || "sk-2dFvkITb1mr3yG7FdIYkc62mZPZKMSIsvdU0dLKaiyduuO3B"
  const baseUrl = process.env.CHATA_BASE_URL || "https://www.chataiapi.com/v1"
  const modelName = process.env.CHATA_MODEL_NAME || "gpt-3.5-turbo"
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000) // 15秒超时
  
  try {
    console.log('发起ChatAI API排版请求:', {
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
      temperature: 0.3
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
      console.log('ChatAI API排版响应成功:', {
        status: response.status,
        model: data.model,
        usage: data.usage,
        hasChoices: !!data.choices,
        choiceCount: data.choices?.length || 0
      })
      
      // 检查响应结构
      const choice = data.choices?.[0]
      let content = '排版失败'
      
      if (choice?.message?.content) {
        content = choice.message.content
        console.log('API返回内容长度:', content.length)
        console.log('API返回内容预览:', content.substring(0, 200))
        
        // 检查是否包含HTML标签
        if (!content.includes('<') || !content.includes('>')) {
          console.warn('API返回内容不包含HTML标签，内容:', content)
          throw new Error('API返回内容格式不正确，不包含HTML标签')
        }
      } else if (choice?.finish_reason === 'length') {
        content = '排版内容被截断（达到最大token限制），请尝试减少输入长度'
        console.warn('API响应被截断，finish_reason:', choice.finish_reason)
      } else if (choice?.finish_reason) {
        content = `排版完成，原因：${choice.finish_reason}`
        console.warn('API响应完成，finish_reason:', choice.finish_reason)
      } else {
        console.error('API响应结构异常:', JSON.stringify(data, null, 2))
        throw new Error('API响应格式异常，没有找到有效内容')
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

// 自定义排版模板
const CUSTOM_FORMATTING_TEMPLATE = `
<p style="margin-bottom: 0px;">
  <span leaf=""><br></span>
</p>
<p data-mpa-powered-by="yiban.io" style="-webkit-tap-highlight-color: transparent;margin-bottom: 0px;outline: 0px;letter-spacing: 0.544px;font-family: -apple-system-font, BlinkMacSystemFont, &quot;Helvetica Neue&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei UI&quot;, &quot;Microsoft YaHei&quot;, Arial, sans-serif;text-align: center;visibility: visible;">
    <span style="-webkit-tap-highlight-color: transparent;outline: 0px;font-size: 11px;letter-spacing: 1px;color: rgb(217, 33, 66);visibility: visible;"><span leaf="">▲</span></span>
    <span style="-webkit-tap-highlight-color: transparent;outline: 0px;font-size: 10px;letter-spacing: 2px;text-align: right;color: rgb(51, 102, 153);visibility: visible;"><strong style="-webkit-tap-highlight-color: transparent;outline: 0px;visibility: visible;"><span leaf="">&nbsp;点击上方第二个"徐子叶"</span></strong></span>
    <span style="-webkit-tap-highlight-color: transparent;outline: 0px;color: rgb(62, 62, 62);font-size: 10px;letter-spacing: 2px;text-align: right;visibility: visible;"><span leaf="">关注公众号</span></span>
  </p>
  <p style="-webkit-tap-highlight-color: transparent;margin-bottom: 0px;outline: 0px;letter-spacing: 0.544px;font-family: -apple-system-font, BlinkMacSystemFont, &quot;Helvetica Neue&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei UI&quot;, &quot;Microsoft YaHei&quot;, Arial, sans-serif;text-align: center;visibility: visible;">
    <span style="-webkit-tap-highlight-color: transparent;outline: 0px;color: rgb(62, 62, 62);font-size: 10px;letter-spacing: 2px;text-align: right;visibility: visible;"><span leaf="">回复</span></span>
    <span style="-webkit-tap-highlight-color: transparent;outline: 0px;font-size: 10px;letter-spacing: 2px;text-align: right;color: rgb(255, 0, 0);visibility: visible;"><span leaf="">"1"</span></span>
    <span style="-webkit-tap-highlight-color: transparent;outline: 0px;color: rgb(62, 62, 62);font-size: 10px;letter-spacing: 2px;text-align: right;visibility: visible;"><span leaf="">加</span></span>
    <span style="-webkit-tap-highlight-color: transparent;outline: 0px;font-size: 10px;letter-spacing: 2px;text-align: right;visibility: visible;"><span style="-webkit-tap-highlight-color: transparent;outline: 0px;color: rgb(62, 62, 62);visibility: visible;"><span leaf="">入</span></span></span>
    <span style="-webkit-tap-highlight-color: transparent;outline: 0px;font-size: 10px;letter-spacing: 2px;text-align: right;color: rgb(255, 0, 0);visibility: visible;"><span leaf="">社群</span></span>
  </p>
  <p style="margin-bottom: 0px;">
    <span leaf=""><br></span>
  </p>
  <section style="-webkit-tap-highlight-color: transparent;margin-right: 0em;margin-bottom: 0px;margin-left: 0em;outline: 0px;text-size-adjust: inherit;text-align: start;line-height: 25.6px;visibility: visible;">
    <section style="-webkit-tap-highlight-color: transparent;outline: 0px;visibility: visible;">
      <p style="-webkit-tap-highlight-color: transparent;margin-right: 0.5em;margin-left: 0.5em;outline: 0px;font-family: -apple-system-font, BlinkMacSystemFont, &quot;Helvetica Neue&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei UI&quot;, &quot;Microsoft YaHei&quot;, Arial, sans-serif;font-size: medium;text-align: center;line-height: 1.5em;visibility: visible;">
        <span style="-webkit-tap-highlight-color: transparent;outline: 0px;font-size: 13px;visibility: visible;"><span style="-webkit-tap-highlight-color: transparent;outline: 0px;font-size: medium;visibility: visible;"><span style="-webkit-tap-highlight-color: transparent;outline: 0px;font-size: 13px;visibility: visible;"><span style="-webkit-tap-highlight-color: transparent;outline: 0px;color: rgb(136, 136, 136);visibility: visible;"><span style="-webkit-tap-highlight-color: transparent;outline: 0px;letter-spacing: 0.5px;visibility: visible;"><span leaf="">思考洞察</span></span></span><strong style="-webkit-tap-highlight-color: transparent;outline: 0px;color: rgb(0, 0, 0);letter-spacing: 0.544px;visibility: visible;"><span leaf="">&nbsp;</span></strong></span></span><span style="-webkit-tap-highlight-color: transparent;outline: 0px;color: rgb(136, 136, 136);visibility: visible;"><span style="-webkit-tap-highlight-color: transparent;outline: 0px;letter-spacing: 0.5px;visibility: visible;"><span leaf="">丨作者 / 徐 子 叶</span></span></span><span style="-webkit-tap-highlight-color: transparent;outline: 0px;color: rgb(136, 136, 136);visibility: visible;"><span style="-webkit-tap-highlight-color: transparent;outline: 0px;letter-spacing: 0.5px;visibility: visible;"><span leaf="">&nbsp; &nbsp;&nbsp;</span></span></span></span>
      </p>
      <p style="-webkit-tap-highlight-color: transparent;margin-right: 0.5em;margin-left: 0.5em;outline: 0px;letter-spacing: 0.544px;font-family: -apple-system-font, BlinkMacSystemFont, &quot;Helvetica Neue&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei UI&quot;, &quot;Microsoft YaHei&quot;, Arial, sans-serif;font-size: medium;text-align: center;line-height: 1.5em;visibility: visible;">
        <span style="-webkit-tap-highlight-color: transparent;outline: 0px;color: rgb(62, 62, 62);font-size: 10px;letter-spacing: 2px;text-align: right;visibility: visible;"><span leaf="">这是</span></span>
        <span style="-webkit-tap-highlight-color: transparent;outline: 0px;font-size: 10px;letter-spacing: 2px;text-align: right;color: rgb(51, 102, 153);visibility: visible;"><strong style="-webkit-tap-highlight-color: transparent;outline: 0px;visibility: visible;"><span leaf="">徐子叶</span></strong></span>
        <span style="-webkit-tap-highlight-color: transparent;outline: 0px;font-size: 10px;letter-spacing: 2px;text-align: right;color: rgb(51, 102, 153);visibility: visible;"><strong style="-webkit-tap-highlight-color: transparent;outline: 0px;visibility: visible;"><span leaf="">公众号</span></strong></span>
        <span style="-webkit-tap-highlight-color: transparent;outline: 0px;color: rgb(62, 62, 62);font-size: 10px;letter-spacing: 2px;text-align: right;visibility: visible;"><span leaf="">的第</span></span>
        <span style="-webkit-tap-highlight-color: transparent;outline: 0px;font-size: 10px;letter-spacing: 2px;text-align: right;color: rgb(51, 102, 153);visibility: visible;"><strong style="-webkit-tap-highlight-color: transparent;outline: 0px;visibility: visible;"><span leaf="">012</span></strong></span>
        <span style="-webkit-tap-highlight-color: transparent;outline: 0px;color: rgb(62, 62, 62);font-size: 10px;letter-spacing: 2px;text-align: right;visibility: visible;"><span leaf="">篇原创文章</span></span>
      </p>
      <p style="-webkit-tap-highlight-color: transparent;margin-right: 0.5em;margin-left: 0.5em;outline: 0px;letter-spacing: 0.544px;font-family: -apple-system-font, BlinkMacSystemFont, &quot;Helvetica Neue&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei UI&quot;, &quot;Microsoft YaHei&quot;, Arial, sans-serif;font-size: medium;text-align: center;line-height: 1.5em;visibility: visible;">
        <span style="-webkit-tap-highlight-color: transparent;outline: 0px;color: rgb(62, 62, 62);font-size: 10px;letter-spacing: 2px;text-align: right;visibility: visible;"><span leaf=""><br></span></span>
      </p>
      <p style="-webkit-tap-highlight-color: transparent;margin-right: 0.5em;margin-left: 0.5em;outline: 0px;letter-spacing: 0.544px;font-family: -apple-system-font, BlinkMacSystemFont, &quot;Helvetica Neue&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei UI&quot;, &quot;Microsoft YaHei&quot;, Arial, sans-serif;font-size: medium;text-align: center;line-height: 1.5em;visibility: visible;">
        <span leaf=""><br></span>
      </p>
      <p style="-webkit-tap-highlight-color: transparent;margin-right: 0.5em;margin-left: 0.5em;outline: 0px;letter-spacing: 0.544px;font-family: -apple-system-font, BlinkMacSystemFont, &quot;Helvetica Neue&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei UI&quot;, &quot;Microsoft YaHei&quot;, Arial, sans-serif;font-size: medium;text-align: center;line-height: 1.5em;visibility: visible;">
        <span leaf=""><br></span>
      </p>
    </section>
  </section>
  <p style="margin-bottom: 0px;">
    <span leaf=""><br></span>
  </p>
  <hr style="-webkit-tap-highlight-color: transparent;outline: 0px;border-style: solid;border-right-width: 0px;border-bottom-width: 0px;border-left-width: 0px;border-color: rgba(0, 0, 0, 0.1);transform-origin: 0px 0px;transform: scale(1, 0.5);">
  
  <!-- 文章内容占位符 -->
  <!-- ARTICLE_CONTENT_PLACEHOLDER -->
  
  <p style="-webkit-tap-highlight-color: transparent;margin-right: 0.5em;margin-bottom: 15px;margin-left: 0.5em;outline: 0px;font-family: -apple-system-font, BlinkMacSystemFont, &quot;Helvetica Neue&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei UI&quot;, &quot;Microsoft YaHei&quot;, Arial, sans-serif;letter-spacing: 0.544px;color: rgb(0, 0, 0);font-size: medium;text-size-adjust: inherit;text-align: center;line-height: 1.5em;">
    <span style="-webkit-tap-highlight-color: transparent;outline: 0px;font-size: 13px;letter-spacing: 0.5px;text-align: start;"><span leaf="">&nbsp;花半秒钟就看透事物本质的人， &nbsp;和花一辈子都看不清的人， &nbsp;注定是截然不同的命运。</span></span>
  </p>
  <p style="-webkit-tap-highlight-color: transparent;margin-right: 0.5em;margin-bottom: 0px;margin-left: 0.5em;outline: 0px;font-family: -apple-system-font, BlinkMacSystemFont, &quot;Helvetica Neue&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei UI&quot;, &quot;Microsoft YaHei&quot;, Arial, sans-serif;letter-spacing: 0.544px;color: rgb(0, 0, 0);font-size: medium;line-height: 1.5em;text-align: center;">
    <span style="-webkit-tap-highlight-color: transparent;outline: 0px;color: rgb(255, 0, 0);"><strong style="-webkit-tap-highlight-color: transparent;outline: 0px;"><span style="-webkit-tap-highlight-color: transparent;outline: 0px;letter-spacing: 0.5px;font-size: 13px;"><span leaf="">点击下方卡片关注徐子叶</span></span></strong><strong style="-webkit-tap-highlight-color: transparent;outline: 0px;"><span style="-webkit-tap-highlight-color: transparent;outline: 0px;letter-spacing: 0.5px;font-size: 13px;"><span leaf="">，和</span></span></strong><span style="-webkit-tap-highlight-color: transparent;outline: 0px;font-size: 17px;"><strong style="-webkit-tap-highlight-color: transparent;outline: 0px;"><span style="-webkit-tap-highlight-color: transparent;outline: 0px;letter-spacing: 0.5px;"><span leaf="">100万读者</span></span></strong></span><strong style="-webkit-tap-highlight-color: transparent;outline: 0px;"><span style="-webkit-tap-highlight-color: transparent;outline: 0px;letter-spacing: 0.5px;font-size: 13px;"><span leaf="">一起</span></span></strong></span>
  </p>
  <p style="-webkit-tap-highlight-color: transparent;margin-right: 0.5em;margin-bottom: 0px;margin-left: 0.5em;outline: 0px;font-family: -apple-system-font, BlinkMacSystemFont, &quot;Helvetica Neue&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei UI&quot;, &quot;Microsoft YaHei&quot;, Arial, sans-serif;letter-spacing: 0.544px;color: rgb(0, 0, 0);font-size: medium;line-height: 1.5em;text-align: center;">
    <span style="-webkit-tap-highlight-color: transparent;outline: 0px;color: rgb(255, 0, 0);"><strong style="-webkit-tap-highlight-color: transparent;outline: 0px;"><span style="-webkit-tap-highlight-color: transparent;outline: 0px;letter-spacing: 0.5px;font-size: 13px;"><span leaf="">进行知识变现</span></span></strong></span>
  </p>
  <p style="-webkit-tap-highlight-color: transparent;margin-bottom: 0px;outline: 0px;font-family: -apple-system-font, BlinkMacSystemFont, &quot;Helvetica Neue&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei UI&quot;, &quot;Microsoft YaHei&quot;, Arial, sans-serif;text-size-adjust: inherit;color: rgb(62, 62, 62);font-size: 15px;letter-spacing: 2px;text-align: center;">
    <span leaf=""><img data-src="https://mmbiz.qpic.cn/mmbiz_png/b96CibCt70iaajvl7fD4ZCicMcjhXMp1v6UibM134tIsO1j5yqHyNhh9arj090oAL7zGhRJRq6cFqFOlDZMleLl4pw/640?wx_fmt=other&amp;wxfrom=5&amp;wx_lazy=1&amp;wx_co=1&amp;tp=webp" class="rich_pages wxw-img" data-ratio="1" data-type="png" data-w="64" style="-webkit-tap-highlight-color: transparent;outline: 0px;font-variant-numeric: normal;letter-spacing: 0.544px;line-height: 27.2px;widows: 1;max-height: 20px !important;visibility: visible !important;width: 20px !important;" width="20px" data-imgfileid="502008647" src="https://mmbiz.qpic.cn/mmbiz_png/b96CibCt70iaajvl7fD4ZCicMcjhXMp1v6UibM134tIsO1j5yqHyNhh9arj090oAL7zGhRJRq6cFqFOlDZMleLl4pw/640?wx_fmt=other&amp;wxfrom=5&amp;wx_lazy=1&amp;wx_co=1&amp;tp=webp"></span>
  </p>
  <p style="margin-bottom: 0px;">
    <span leaf=""><br></span>
  </p>
  <section class="mp_profile_iframe_wrp" style="-webkit-tap-highlight-color: transparent;outline: 0px;margin-bottom: 0px;">
    <span leaf=""><mp-common-profile class="js_uneditable custom_select_card mp_profile_iframe js_wx_tap_highlight" data-pluginname="mpprofile" data-nickname="徐子叶" data-alias="xuziye_public" data-index="0" data-from="2" data-headimg="http://mmbiz.qpic.cn/mmbiz_png/OOpKVqIPJOicPHsTDznDic0ico6LDtD2K1OAz0aYuRBDUMEjS2ZiazO8ZibhUciaZcCaAtdESicbR6icSyGjuER1xQllWg/300?wx_fmt=png&amp;wxfrom=19" data-signature="学习，写作，投资，利他。" data-id="MzAxNzEyNTMwOQ==" data-is_biz_ban="0" data-origin_num="2" data-biz_account_status="0">
      </mp-common-profile></span>
  </section>
  <section style="-webkit-tap-highlight-color: transparent;margin-bottom: 0px;outline: 0px;font-family: -apple-system-font, BlinkMacSystemFont, &quot;Helvetica Neue&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei UI&quot;, &quot;Microsoft YaHei&quot;, Arial, sans-serif;letter-spacing: 0.544px;text-align: center;">
    <strong style="-webkit-tap-highlight-color: transparent;outline: 0px;letter-spacing: 0.5px;color: rgb(62, 62, 62);font-family: -apple-system-font, BlinkMacSystemFont, &quot;Helvetica Neue&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei UI&quot;, &quot;Microsoft YaHei&quot;, Arial, sans-serif;font-size: 15px;"><span style="-webkit-tap-highlight-color: transparent;outline: 0px;font-size: 12px;"><span style="-webkit-tap-highlight-color: transparent;outline: 0px;color: rgb(217, 33, 66);"><span leaf="">▲&nbsp;</span></span><span leaf="">点击上方卡片关注徐子叶，进行知识变现</span></span></strong>
  </section>
  <p style="margin-bottom: 0px;">
    <span leaf=""><br></span>
  </p>
  <p style="-webkit-tap-highlight-color: transparent;margin-right: 0.5em;margin-bottom: 0px;margin-left: 0.5em;outline: 0px;font-family: -apple-system-font, BlinkMacSystemFont, &quot;Helvetica Neue&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei UI&quot;, &quot;Microsoft YaHei&quot;, Arial, sans-serif;letter-spacing: 0.544px;color: rgb(0, 0, 0);font-size: medium;text-size-adjust: inherit;text-align: center;line-height: 1.5em;">
    <strong style="-webkit-tap-highlight-color: transparent;outline: 0px;letter-spacing: 0.544px;"><span style="-webkit-tap-highlight-color: transparent;outline: 0px;letter-spacing: 0.5px;font-size: 13px;color: rgb(136, 136, 136);"><span leaf="">品牌推广&nbsp;</span></span></strong>
    <span style="-webkit-tap-highlight-color: transparent;outline: 0px;letter-spacing: 0.5px;font-size: 13px;color: rgb(136, 136, 136);"><span leaf="">|&nbsp;</span></span>
    <strong style="-webkit-tap-highlight-color: transparent;outline: 0px;letter-spacing: 0.544px;"><span style="-webkit-tap-highlight-color: transparent;outline: 0px;letter-spacing: 0.5px;font-size: 13px;color: rgb(136, 136, 136);"><span leaf="">培训合作&nbsp;</span></span></strong>
    <strong style="-webkit-tap-highlight-color: transparent;outline: 0px;letter-spacing: 0.544px;"><span style="-webkit-tap-highlight-color: transparent;outline: 0px;letter-spacing: 0.5px;font-size: 13px;color: rgb(136, 136, 136);"><span leaf="">&nbsp;| 转载开白</span></span></strong>
  </p>
  <p style="-webkit-tap-highlight-color: transparent;margin-right: 0.5em;margin-bottom: 15px;margin-left: 0.5em;outline: 0px;font-family: -apple-system-font, BlinkMacSystemFont, &quot;Helvetica Neue&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei UI&quot;, &quot;Microsoft YaHei&quot;, Arial, sans-serif;letter-spacing: 0.544px;color: rgb(0, 0, 0);font-size: medium;text-size-adjust: inherit;text-align: center;line-height: 1.5em;">
    <span style="-webkit-tap-highlight-color: transparent;outline: 0px;letter-spacing: 0.5px;font-size: 13px;color: rgb(136, 136, 136);"><span leaf="">请在公众号后台回复&nbsp;</span></span>
    <span style="-webkit-tap-highlight-color: transparent;outline: 0px;color: rgb(255, 255, 255);background-color: rgb(255, 0, 0);"><strong style="-webkit-tap-highlight-color: transparent;outline: 0px;"><span style="-webkit-tap-highlight-color: transparent;outline: 0px;letter-spacing: 0.5px;font-size: 13px;"><span leaf="">&nbsp;合作&nbsp;</span></span></strong></span>
  </p>
  <p style="margin-bottom: 0px;">
    <span leaf=""><br></span>
  </p>
  <section style="-webkit-tap-highlight-color: transparent;margin-bottom: 0px;outline: 0px;letter-spacing: 0.544px;font-family: &quot;Helvetica Neue&quot;, Helvetica, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei&quot;, Arial, sans-serif;text-align: start;line-height: 25.6px;">
    <section style="-webkit-tap-highlight-color: transparent;margin: 0.8em 1em;outline: 0px;line-height: 25.6px;">
      <section style="-webkit-tap-highlight-color: transparent;outline: 0px;line-height: 25.6px;">
        <section style="-webkit-tap-highlight-color: transparent;outline: 0px;">
          <section style="-webkit-tap-highlight-color: transparent;margin: 5px 8px;outline: 0px;min-height: 1em;letter-spacing: 0.544px;text-align: center;line-height: normal;">
            <span style="-webkit-tap-highlight-color: transparent;outline: 0px;font-size: 13px;color: rgb(255, 0, 0);"><strong style="-webkit-tap-highlight-color: transparent;outline: 0px;"><span leaf="">长按识别下方二维码，和10000位朋友一起</span></strong></span>
          </section>
          <section style="-webkit-tap-highlight-color: transparent;margin: 5px 8px;outline: 0px;min-height: 1em;letter-spacing: 0.544px;text-align: center;line-height: normal;">
            <span style="-webkit-tap-highlight-color: transparent;outline: 0px;color: rgb(255, 0, 0);"><span style="-webkit-tap-highlight-color: transparent;outline: 0px;font-size: 13px;"><strong style="-webkit-tap-highlight-color: transparent;outline: 0px;"><span leaf="">把别人的顿悟，变成你的基本功</span></strong></span></span>
          </section>
        </section>
      </section>
    </section>
  </section>
  <p style="margin-bottom: 0px;">
    <span leaf=""><br></span>
  </p>
  <p style="-webkit-tap-highlight-color: transparent;margin-bottom: 0px;outline: 0px;font-family: -apple-system-font, &quot;system-ui&quot;, &quot;Helvetica Neue&quot;, &quot;PingFang SC&quot;, &quot;Hiragino Sans GB&quot;, &quot;Microsoft YaHei UI&quot;, &quot;Microsoft YaHei&quot;, Arial, sans-serif;letter-spacing: 0.544px;text-align: center;">
    <span leaf=""><br></span>
  </p>
  <p style="-webkit-tap-highlight-color: transparent;margin-bottom: 0px;outline: 0px;text-align: center;">
    <span leaf=""><img data-src="https://mmbiz.qpic.cn/mmbiz_jpg/OOpKVqIPJO8RNaA4FGJuAIaNj5ybibhFac45jcySs5Ige6vLWlIHSia7ibgCZjMnT74e77K6X8UjfEmf5KKrU7jJw/640?wx_fmt=other&amp;from=appmsg&amp;tp=webp&amp;wxfrom=5&amp;wx_lazy=1&amp;wx_co=1" class="rich_pages wxw-img js_insertlocalimg" data-ratio="0.6296296296296297" data-s="300,640" data-type="jpeg" data-w="1080" style="-webkit-tap-highlight-color: transparent;outline: 0px;visibility: visible !important;width: 677px !important;" data-imgfileid="502008646" data-imgqrcoded="1" src="https://mmbiz.qpic.cn/mmbiz_jpg/OOpKVqIPJO8RNaA4FGJuAIaNj5ybibhFac45jcySs5Ige6vLWlIHSia7ibgCZjMnT74e77K6X8UjfEmf5KKrU7jJw/640?wx_fmt=other&amp;from=appmsg&amp;tp=webp&amp;wxfrom=5&amp;wx_lazy=1&amp;wx_co=1"></span>
  </p>
  <p style="margin-bottom: 0px;">
    <span leaf=""><br></span>
  </p>
  <p style="margin-bottom: 0px;">
    <span style="-webkit-tap-highlight-color: transparent;outline: 0px;display: block;color: var(--weui-FG-0);font-size: 15px;"></span>
  </p>
  <h1 data-v-a5b5d8f9="" style="-webkit-tap-highlight-color: transparent;margin-top: 8px;outline: 0px;font-size: 20px;">
    <span leaf=""><br></span>
  </h1>
  <p data-v-a5b5d8f9="" style="-webkit-tap-highlight-color: transparent;margin-top: 8px;margin-bottom: 32px;outline: 0px;font-size: 15px;">
    <span leaf=""><br></span>
  </p>
  <p data-v-f087d6a3="" style="-webkit-tap-highlight-color: transparent;outline: 0px;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;font-size: 15px;margin-bottom: 0px;">
    <span leaf=""><br></span>
  </p>
  <p data-v-f087d6a3="" style="-webkit-tap-highlight-color: transparent;margin-top: 4px;outline: 0px;color: var(--weui-FG-1);line-height: 20px;width: auto;overflow: hidden;text-overflow: ellipsis;overflow-wrap: normal;text-indent: 24px;margin-bottom: 0px;">
    <span data-v-f087d6a3="" style="-webkit-tap-highlight-color: transparent;outline: 0px;width: 20px;height: 20px;border-radius: 50%;display: inline-block;left: 0px;"></span>
  </p>
  <p data-v-a5b5d8f9="" style="-webkit-tap-highlight-color: transparent;outline: 0px;font-size: 15px;margin-bottom: 0px;">
    <span leaf=""><br></span>
  </p>
  <p style="margin-bottom: 0px;">
    <span leaf=""><br></span>
  </p>
  <section>
    <span leaf=""><br></span>
  </section>
  <p style="display: none;">
    <mp-style-type data-value="3">
    </mp-style-type>
  </p>`

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
6. 文章内容要放在自定义模板的中间位置

文章内容：
${article}

请直接输出HTML代码，不要包含任何说明文字。`

      console.log('开始调用ChatAI API进行排版...')
      const formattedContent = await callChatAIForFormat(prompt, 2000)
      console.log('ChatAI API排版成功，返回内容长度:', formattedContent.length)
      
      // 将AI生成的内容插入到自定义模板中
      const finalContent = CUSTOM_FORMATTING_TEMPLATE.replace('<!-- ARTICLE_CONTENT_PLACEHOLDER -->', formattedContent)
      
      return NextResponse.json({ 
        success: true, 
        data: finalContent
      })
    } catch (apiError) {
      console.error('ChatAI API调用失败，错误详情:', apiError)
      
      // 不使用备用方案，直接返回错误
      return NextResponse.json({ 
        success: false, 
        error: 'AI排版服务暂时不可用',
        message: 'ChatAI API调用失败，请稍后重试',
        details: apiError instanceof Error ? apiError.message : String(apiError)
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