'use client'

import React, { useState } from 'react'
import { FileText, Wand2, Copy, Download, ArrowLeft, Send, Eye, Sparkles, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function FormatPage() {
  const [inputArticle, setInputArticle] = useState('')
  const [formattedArticle, setFormattedArticle] = useState('')
  const [isFormatting, setIsFormatting] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [error, setError] = useState('')
  const [showFullContent, setShowFullContent] = useState(false)
  const [publishData, setPublishData] = useState({
    title: '',
    author: '',
    digest: '',
    openId: ''
  })
  const [showPublishModal, setShowPublishModal] = useState(false)

  const handleFormat = async () => {
    if (!inputArticle.trim()) {
      setError('请输入要排版的文章内容')
      return
    }

    setIsFormatting(true)
    setError('')

    try {
      const response = await fetch('/api/format', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article: inputArticle })
      })

      const data = await response.json()

      if (data.success) {
        let htmlContent = data.data
        
        // 自动修复不完整的HTML
        const hasOpeningDiv = htmlContent.includes('<div')
        const hasClosingDiv = htmlContent.includes('</div>')
        const hasOpeningP = htmlContent.includes('<p')
        const hasClosingP = htmlContent.includes('</p>')
        
        // 如果缺少结束div标签，自动添加
        if (hasOpeningDiv && !hasClosingDiv) {
          htmlContent += '\n</div>'
          console.log('✅ 已自动修复：添加结束div标签')
        }
        
        // 检查p标签是否平衡
        const pCount = (htmlContent.match(/<p/g) || []).length
        const closingPCount = (htmlContent.match(/<\/p>/g) || []).length
        
        if (pCount > closingPCount) {
          const missingP = pCount - closingPCount
          for (let i = 0; i < missingP; i++) {
            htmlContent += '\n</p>'
          }
          console.log(`✅ 已自动修复：添加${missingP}个结束p标签`)
        }
        
        setFormattedArticle(htmlContent)
        
        // 调试输出：在控制台显示完整的HTML内容
        console.log('完整的HTML内容:', htmlContent)
        console.log('HTML内容长度:', htmlContent.length)
        
        // 详细的HTML完整性检查
        const divCount = (htmlContent.match(/<div/g) || []).length
        const closingDivCount = (htmlContent.match(/<\/div>/g) || []).length
        const finalPCount = (htmlContent.match(/<p/g) || []).length
        const finalClosingPCount = (htmlContent.match(/<\/p>/g) || []).length
        
        console.log('HTML完整性详细检查:')
        console.log('- div标签数量:', divCount, '结束div标签数量:', closingDivCount)
        console.log('- p标签数量:', finalPCount, '结束p标签数量:', finalClosingPCount)
        console.log('- div标签平衡:', divCount === closingDivCount)
        console.log('- p标签平衡:', finalPCount === finalClosingPCount)
        
        // 检查是否有未闭合的标签
        if (divCount !== closingDivCount || finalPCount !== finalClosingPCount) {
          console.warn('⚠️ 仍有未闭合的HTML标签')
        } else {
          console.log('✅ HTML标签已完全平衡')
        }
      } else {
        throw new Error(data.error || '排版失败')
      }
    } catch (error) {
      console.error('排版错误:', error)
      setError(error instanceof Error ? error.message : '排版失败，请重试')
    } finally {
      setIsFormatting(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedArticle)
  }

  const handleDownload = () => {
    const blob = new Blob([formattedArticle], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `formatted-article-${Date.now()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePublish = async (action: 'preview' | 'publish') => {
    if (!formattedArticle || !publishData.title) {
      setError('请先排版文章并填写标题')
      return
    }

    if (action === 'preview' && !publishData.openId) {
      setError('预览需要填写OpenID')
      return
    }

    setIsPublishing(true)
    setError('')

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: publishData.title,
          content: formattedArticle,
          author: publishData.author,
          digest: publishData.digest,
          action,
          openId: publishData.openId
        })
      })

      const data = await response.json()

      if (data.success) {
        alert(data.data.message)
        setShowPublishModal(false)
      } else {
        // 检查是否是配置错误
        if (data.configMissing) {
          const errorMessage = `微信公众号配置不完整：${data.error}\n\n请按以下步骤配置：\n1. 在项目根目录创建 .env.local 文件\n2. 添加以下配置：\nWECHAT_APP_ID=wxc66e3754c009becc\nWECHAT_APP_SECRET=您的开发者密码\n3. 重启应用`
          alert(errorMessage)
        } else {
          throw new Error(data.error || '发布失败')
        }
      }
    } catch (error) {
      console.error('发布错误:', error)
      setError(error instanceof Error ? error.message : '发布失败，请重试')
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-12 animate-fade-in">
          <div className="flex items-center mb-6">
            <Link href="/" className="mr-4 p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors group">
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white" />
            </Link>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mr-4">
                <Wand2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  文章排版工具
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  将您的文章自动转换为专业的公众号排版格式
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Module */}
          <div className="animate-slide-in">
            <div className="notion-card notion-card-hover p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-500" />
                  输入文章
                </h2>
                <span className="notion-badge notion-badge-blue">原始内容</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    原始文章内容
                  </label>
                  <textarea
                    value={inputArticle}
                    onChange={(e) => setInputArticle(e.target.value)}
                    placeholder="请粘贴您要排版的文章内容..."
                    className="notion-textarea h-96 font-mono text-sm"
                  />
                </div>
                
                <button
                  onClick={handleFormat}
                  disabled={isFormatting || !inputArticle.trim()}
                  className="w-full notion-button notion-button-primary flex items-center justify-center py-3"
                >
                  {isFormatting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      排版中...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-2" />
                      自动排版
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Output Module */}
          <div className="animate-slide-in">
            <div className="notion-card notion-card-hover p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                  排版结果
                </h2>
                {formattedArticle && (
                  <span className="notion-badge notion-badge-green">已完成</span>
                )}
              </div>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {formattedArticle ? (
                  <>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <div className={`text-gray-800 dark:text-gray-200 font-mono text-sm leading-relaxed overflow-y-auto border border-gray-200 dark:border-gray-600 rounded p-3 bg-white dark:bg-gray-900 ${showFullContent ? '' : 'max-h-[800px]'}`}>
                          <pre className="whitespace-pre-wrap break-words m-0">{formattedArticle}</pre>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            内容长度: {formattedArticle.length} 字符
                            {(() => {
                              const hasOpeningDiv = formattedArticle.includes('<div')
                              const hasClosingDiv = formattedArticle.includes('</div>')
                              const hasOpeningP = formattedArticle.includes('<p')
                              const hasClosingP = formattedArticle.includes('</p>')
                              const hasCompleteTags = hasOpeningDiv && hasClosingDiv && hasOpeningP && hasClosingP
                              
                              // 检查是否有未闭合的标签
                              const divCount = (formattedArticle.match(/<div/g) || []).length
                              const closingDivCount = (formattedArticle.match(/<\/div>/g) || []).length
                              const pCount = (formattedArticle.match(/<p/g) || []).length
                              const closingPCount = (formattedArticle.match(/<\/p>/g) || []).length
                              
                              const isBalanced = divCount === closingDivCount && pCount === closingPCount
                              
                              return hasCompleteTags && isBalanced ? ' ✅ HTML完整' : ' ⚠️ HTML可能不完整'
                            })()}
                          </div>
                          <button
                            onClick={() => setShowFullContent(!showFullContent)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {showFullContent ? '收起内容' : '展开完整内容'}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={handleCopy}
                        className="flex-1 notion-button notion-button-primary flex items-center justify-center"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        复制内容
                      </button>
                      <button
                        onClick={handleDownload}
                        className="flex-1 notion-button notion-button-secondary flex items-center justify-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        下载HTML
                      </button>
                      <button
                        onClick={() => setShowPublishModal(true)}
                        className="flex-1 notion-button notion-button-primary flex items-center justify-center"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        发布到公众号
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Wand2 className="w-10 h-10 opacity-50" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">输入文章后点击排版按钮开始处理</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              排版特色
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              专业的公众号排版解决方案
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="notion-card notion-card-hover p-8 text-center group">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                专业排版
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                严格按照公众号排版规范，自动应用字体、颜色、间距等样式
              </p>
            </div>
            
            <div className="notion-card notion-card-hover p-8 text-center group">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Wand2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                智能优化
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                自动添加分割线、强调样式、章节编号，提升阅读体验
              </p>
            </div>
            
            <div className="notion-card notion-card-hover p-8 text-center group">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Send className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                一键发布
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                支持预览和直接发布到公众号，无需手动复制粘贴
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 发布模态框 */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="notion-card p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                发布到公众号
              </h3>
              <span className="notion-badge notion-badge-purple">发布</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  文章标题 *
                </label>
                <input
                  type="text"
                  value={publishData.title}
                  onChange={(e) => setPublishData({...publishData, title: e.target.value})}
                  className="notion-input"
                  placeholder="请输入文章标题"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  作者
                </label>
                <input
                  type="text"
                  value={publishData.author}
                  onChange={(e) => setPublishData({...publishData, author: e.target.value})}
                  className="notion-input"
                  placeholder="请输入作者名称"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  摘要
                </label>
                <textarea
                  value={publishData.digest}
                  onChange={(e) => setPublishData({...publishData, digest: e.target.value})}
                  className="notion-textarea"
                  rows={3}
                  placeholder="请输入文章摘要"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  OpenID（预览用）
                </label>
                <input
                  type="text"
                  value={publishData.openId}
                  onChange={(e) => setPublishData({...publishData, openId: e.target.value})}
                  className="notion-input"
                  placeholder="用于预览的微信OpenID"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowPublishModal(false)}
                className="flex-1 notion-button notion-button-secondary"
              >
                取消
              </button>
              <button
                onClick={() => handlePublish('preview')}
                disabled={isPublishing}
                className="flex-1 notion-button notion-button-primary flex items-center justify-center"
              >
                {isPublishing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    发送中...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    发送预览
                  </>
                )}
              </button>
              <button
                onClick={() => handlePublish('publish')}
                disabled={isPublishing}
                className="flex-1 notion-button notion-button-primary flex items-center justify-center"
              >
                {isPublishing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    发布中...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    发布文章
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 