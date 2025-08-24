// 微信公众号API服务
interface WeChatConfig {
  appId: string
  appSecret: string
  accessToken?: string
  expiresAt?: number
}

interface ArticleData {
  title: string
  content: string
  thumbMediaId?: string
  author?: string
  digest?: string
  contentSourceUrl?: string
  showCoverPic?: number
}

class WeChatAPI {
  private config: WeChatConfig

  constructor(config: WeChatConfig) {
    this.config = config
  }

  // 获取访问令牌
  private async getAccessToken(): Promise<string> {
    // 检查是否有有效的访问令牌
    if (this.config.accessToken && this.config.expiresAt && Date.now() < this.config.expiresAt) {
      return this.config.accessToken
    }

    try {
      const response = await fetch(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${this.config.appId}&secret=${this.config.appSecret}`
      )
      
      const data = await response.json()
      
      if (data.access_token) {
        this.config.accessToken = data.access_token
        this.config.expiresAt = Date.now() + (data.expires_in - 300) * 1000 // 提前5分钟过期
        return data.access_token
      } else {
        throw new Error(`获取访问令牌失败: ${data.errmsg || '未知错误'}`)
      }
    } catch (error) {
      console.error('获取微信访问令牌错误:', error)
      throw new Error('无法获取微信访问令牌')
    }
  }

  // 上传图片素材
  async uploadImage(imageBuffer: Buffer): Promise<string> {
    try {
      const accessToken = await this.getAccessToken()
      
      const formData = new FormData()
      formData.append('media', new Blob([imageBuffer as any]), 'image.jpg')
      
      const response = await fetch(
        `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${accessToken}&type=image`,
        {
          method: 'POST',
          body: formData
        }
      )
      
      const data = await response.json()
      
      if (data.media_id) {
        return data.media_id
      } else {
        throw new Error(`上传图片失败: ${data.errmsg || '未知错误'}`)
      }
    } catch (error) {
      console.error('上传图片错误:', error)
      throw new Error('图片上传失败')
    }
  }

  // 发布图文消息
  async publishArticle(articleData: ArticleData): Promise<string> {
    try {
      const accessToken = await this.getAccessToken()
      
      const article = {
        title: articleData.title,
        thumb_media_id: articleData.thumbMediaId || '',
        author: articleData.author || '',
        digest: articleData.digest || '',
        content: articleData.content,
        content_source_url: articleData.contentSourceUrl || '',
        show_cover_pic: articleData.showCoverPic || 1
      }

      const response = await fetch(
        `https://api.weixin.qq.com/cgi-bin/material/add_news?access_token=${accessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            articles: [article]
          })
        }
      )
      
      const data = await response.json()
      
      if (data.media_id) {
        return data.media_id
      } else {
        throw new Error(`发布文章失败: ${data.errmsg || '未知错误'}`)
      }
    } catch (error) {
      console.error('发布文章错误:', error)
      throw new Error('文章发布失败')
    }
  }

  // 发送预览消息
  async sendPreview(mediaId: string, openId: string): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken()
      
      const response = await fetch(
        `https://api.weixin.qq.com/cgi-bin/message/mass/preview?access_token=${accessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            touser: openId,
            mpnews: {
              media_id: mediaId
            },
            msgtype: 'mpnews'
          })
        }
      )
      
      const data = await response.json()
      
      if (data.errcode === 0) {
        return true
      } else {
        throw new Error(`发送预览失败: ${data.errmsg || '未知错误'}`)
      }
    } catch (error) {
      console.error('发送预览错误:', error)
      throw new Error('预览发送失败')
    }
  }

  // 群发消息
  async sendMassMessage(mediaId: string, tagId?: string): Promise<string> {
    try {
      const accessToken = await this.getAccessToken()
      
      const messageData: any = {
        mpnews: {
          media_id: mediaId
        },
        msgtype: 'mpnews'
      }

      if (tagId) {
        messageData.filter = {
          is_to_all: false,
          tag_id: tagId
        }
      } else {
        messageData.filter = {
          is_to_all: true
        }
      }

      const response = await fetch(
        `https://api.weixin.qq.com/cgi-bin/message/mass/sendall?access_token=${accessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(messageData)
        }
      )
      
      const data = await response.json()
      
      if (data.msg_id) {
        return data.msg_id
      } else {
        throw new Error(`群发消息失败: ${data.errmsg || '未知错误'}`)
      }
    } catch (error) {
      console.error('群发消息错误:', error)
      throw new Error('群发消息失败')
    }
  }
}

// 创建默认实例（需要配置）
export const wechatAPI = new WeChatAPI({
  appId: process.env.WECHAT_APP_ID || '',
  appSecret: process.env.WECHAT_APP_SECRET || ''
})

// 检查微信配置是否完整
export function checkWeChatConfig(): { isValid: boolean; missing: string[] } {
  const missing: string[] = []
  
  if (!process.env.WECHAT_APP_ID) {
    missing.push('WECHAT_APP_ID')
  }
  
  if (!process.env.WECHAT_APP_SECRET) {
    missing.push('WECHAT_APP_SECRET')
  }
  
  return {
    isValid: missing.length === 0,
    missing
  }
}

export default WeChatAPI 