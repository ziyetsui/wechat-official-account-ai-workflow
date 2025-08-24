'use client'

import React, { useState } from 'react'
import { FileText, Wand2, Copy, Download, ArrowLeft, Send, Eye } from 'lucide-react'
import Link from 'next/link'

export default function FormatPage() {
  const [inputArticle, setInputArticle] = useState('')
  const [formattedArticle, setFormattedArticle] = useState('')
  const [isFormatting, setIsFormatting] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [error, setError] = useState('')
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
        setFormattedArticle(data.data)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/" className="mr-4 p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </Link>
            <div className="flex items-center">
              <Wand2 className="w-8 h-8 text-purple-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                文章排版工具
              </h1>
            </div>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            将您的文章自动转换为专业的公众号排版格式
          </p>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Module */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
              <FileText className="w-6 h-6 mr-2 text-blue-500" />
              输入文章
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  原始文章内容
                </label>
                <textarea
                  value={inputArticle}
                  onChange={(e) => setInputArticle(e.target.value)}
                  placeholder="请粘贴您要排版的文章内容..."
                  className="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none font-mono text-sm"
                />
              </div>
              
              <button
                onClick={handleFormat}
                disabled={isFormatting || !inputArticle.trim()}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
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

          {/* Output Module */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
              <Wand2 className="w-6 h-6 mr-2 text-purple-500" />
              排版结果
            </h2>
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              {formattedArticle ? (
                <>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 font-mono text-sm leading-relaxed overflow-auto max-h-96">
                        {formattedArticle}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCopy}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      复制内容
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      下载HTML
                    </button>
                    <button
                      onClick={() => setShowPublishModal(true)}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      发布到公众号
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <Wand2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>输入文章后点击排版按钮开始处理</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            排版特色
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                专业排版
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                严格按照公众号排版规范，自动应用字体、颜色、间距等样式
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wand2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                智能优化
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                自动添加分割线、强调样式、章节编号，提升阅读体验
              </p>
            </div>
            
                          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  一键发布
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  支持预览和直接发布到公众号，无需手动复制粘贴
                </p>
              </div>
          </div>
        </div>
      </div>

      {/* 发布模态框 */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              发布到公众号
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  文章标题 *
                </label>
                <input
                  type="text"
                  value={publishData.title}
                  onChange={(e) => setPublishData({...publishData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="用于预览的微信OpenID"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowPublishModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handlePublish('preview')}
                disabled={isPublishing}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
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
                className="flex-1 flex items-center justify-center px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
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