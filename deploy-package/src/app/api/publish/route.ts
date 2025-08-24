import { NextRequest, NextResponse } from 'next/server'
import { wechatAPI, checkWeChatConfig } from '@/lib/wechat-api'

export async function POST(request: NextRequest) {
  try {
    const { title, content, author, digest, action, openId, tagId } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: '缺少必要参数：标题和内容' },
        { status: 400 }
      )
    }

    if (!action) {
      return NextResponse.json(
        { error: '缺少操作类型：preview（预览）或 publish（发布）' },
        { status: 400 }
      )
    }

    // 检查微信配置
    const configCheck = checkWeChatConfig()
    if (!configCheck.isValid) {
      return NextResponse.json(
        { 
          error: `微信公众号配置不完整，缺少：${configCheck.missing.join(', ')}。请在环境变量中配置这些参数。`,
          configMissing: true
        },
        { status: 400 }
      )
    }

    // 发布文章到微信素材库
    const mediaId = await wechatAPI.publishArticle({
      title,
      content,
      author: author || 'AI助手',
      digest: digest || '',
      showCoverPic: 1
    })

    let result: any = { mediaId }

    // 根据操作类型执行不同操作
    if (action === 'preview') {
      if (!openId) {
        return NextResponse.json(
          { error: '预览操作需要提供openId' },
          { status: 400 }
        )
      }
      
      const previewResult = await wechatAPI.sendPreview(mediaId, openId)
      result.previewSent = previewResult
      result.message = '预览消息已发送'
      
    } else if (action === 'publish') {
      const msgId = await wechatAPI.sendMassMessage(mediaId, tagId)
      result.msgId = msgId
      result.message = '文章已发布到公众号'
      
    } else {
      return NextResponse.json(
        { error: '不支持的操作类型' },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data: result
    })

  } catch (error) {
    console.error('发布文章错误:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : '发布失败，请稍后重试',
        success: false 
      },
      { status: 500 }
    )
  }
} 