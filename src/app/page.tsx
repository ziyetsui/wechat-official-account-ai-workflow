'use client'

import React, { useState } from 'react'
import { Bot, FileText, Image, Send, Sparkles, Type, Wand2, Plus, Settings, Download, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import ExportButton from '@/components/ExportButton'
import AdvancedSettings from '@/components/AdvancedSettings'

interface GeneratedContent {
  content: string
  titles: string[]
  imageSuggestions: string
}

export default function Home() {
  const [topic, setTopic] = useState('')
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'titles' | 'images'>('content')
  const [error, setError] = useState('')
  const [advancedSettings, setAdvancedSettings] = useState({
    targetAudience: '产品经理、创业者、营销人员、对AIGC应用落地感兴趣的人',
    contentLength: '3000-4000字',
    writingStyle: '刘润风格',
    includeExamples: true,
    includeStories: true
  })

  const handleGenerateContent = async () => {
    if (!topic.trim()) return
    
    setIsGenerating(true)
    setError('')
    
    try {
      // 并行生成内容、标题和配图建议
      const [contentRes, titlesRes, imagesRes] = await Promise.all([
        fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, type: 'content', settings: advancedSettings })
        }),
        fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, type: 'title' })
        }),
        fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, type: 'images' })
        })
      ])

      // 检查响应状态
      if (!contentRes.ok || !titlesRes.ok || !imagesRes.ok) {
        const errorText = await contentRes.text()
        console.error('API响应错误:', {
          contentStatus: contentRes.status,
          titlesStatus: titlesRes.status,
          imagesStatus: imagesRes.status,
          errorText
        })
        throw new Error(`API请求失败: ${contentRes.status} ${contentRes.statusText}`)
      }

      const [contentData, titlesData, imagesData] = await Promise.all([
        contentRes.json(),
        titlesRes.json(),
        imagesRes.json()
      ])

      if (contentData.success && titlesData.success && imagesData.success) {
        setGeneratedContent({
          content: contentData.data,
          titles: titlesData.data.split('\n').filter((title: string) => title.trim()),
          imageSuggestions: imagesData.data
        })
      } else {
        console.error('API返回错误:', { contentData, titlesData, imagesData })
        throw new Error('生成失败，请重试')
      }
    } catch (error) {
      console.error('生成错误:', error)
      setError(error instanceof Error ? error.message : '生成失败，请检查网络连接')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-12 animate-fade-in">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mr-4">
                <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  微信公众号AI助手
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  使用AI技术提升公众号内容创作效率
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-6 animate-slide-in">
            {/* Content Generation Card */}
            <div className="notion-card notion-card-hover p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-blue-500" />
                  内容生成
                </h2>
                <span className="notion-badge notion-badge-blue">AI驱动</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    文章主题
                  </label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="请输入文章主题或关键词..."
                    className="notion-textarea"
                    rows={4}
                  />
                </div>
                
                <button
                  onClick={handleGenerateContent}
                  disabled={isGenerating || !topic.trim()}
                  className="w-full notion-button notion-button-primary flex items-center justify-center py-3"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      生成内容
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Advanced Settings Card */}
            <AdvancedSettings 
              settings={advancedSettings}
              onSettingsChange={setAdvancedSettings}
            />

            {/* Quick Actions Card */}
            <div className="notion-card notion-card-hover p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <Settings className="w-5 h-5 mr-2 text-gray-500" />
                快速操作
              </h3>
              
              <div className="space-y-3">
                <Link 
                  href="/format" 
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Wand2 className="w-5 h-5 mr-3 text-purple-500" />
                  <span className="text-gray-700 dark:text-gray-300">文章排版工具</span>
                </Link>
                
                {generatedContent && (
                  <button
                    onClick={() => setGeneratedContent(null)}
                    className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    <RefreshCw className="w-5 h-5 mr-3 text-gray-500" />
                    重新生成
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="lg:col-span-2 animate-slide-in">
            <div className="notion-card notion-card-hover p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-green-500" />
                  生成结果
                </h2>
                {generatedContent && (
                  <span className="notion-badge notion-badge-green">已完成</span>
                )}
              </div>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}
              
              <div className="min-h-[500px]">
                {generatedContent ? (
                  <div className="space-y-6">
                    {/* 标签页导航 */}
                    <div className="flex space-x-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <button
                        onClick={() => setActiveTab('content')}
                        className={`notion-tab flex-1 flex items-center justify-center ${
                          activeTab === 'content' ? 'notion-tab-active' : 'notion-tab-inactive'
                        }`}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        文章内容
                      </button>
                      <button
                        onClick={() => setActiveTab('titles')}
                        className={`notion-tab flex-1 flex items-center justify-center ${
                          activeTab === 'titles' ? 'notion-tab-active' : 'notion-tab-inactive'
                        }`}
                      >
                        <Type className="w-4 h-4 mr-2" />
                        标题建议
                      </button>
                      <button
                        onClick={() => setActiveTab('images')}
                        className={`notion-tab flex-1 flex items-center justify-center ${
                          activeTab === 'images' ? 'notion-tab-active' : 'notion-tab-inactive'
                        }`}
                      >
                        <Image className="w-4 h-4 mr-2" />
                        配图建议
                      </button>
                    </div>

                    {/* 内容显示 */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                      {activeTab === 'content' && (
                        <div className="prose prose-lg max-w-none dark:prose-invert">
                          <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 font-sans leading-relaxed text-sm">
                            {generatedContent.content}
                          </div>
                        </div>
                      )}
                      
                      {activeTab === 'titles' && (
                        <div className="space-y-3">
                          {generatedContent.titles.map((title, index) => (
                            <div key={index} className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                              <div className="flex items-center">
                                <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                                  {index + 1}
                                </span>
                                <p className="text-gray-800 dark:text-gray-200 font-medium">{title}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {activeTab === 'images' && (
                        <div className="prose prose-lg max-w-none dark:prose-invert">
                          <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 font-sans leading-relaxed text-sm">
                            {generatedContent.imageSuggestions}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <ExportButton content={generatedContent} topic={topic} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-10 h-10 opacity-50" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">输入主题后点击生成按钮开始创作</p>
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
              功能特色
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              专业的AI驱动内容创作工具
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="notion-card notion-card-hover p-8 text-center group">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                AI内容生成
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                基于主题智能生成高质量的文章内容，提升创作效率
              </p>
            </div>
            
            <div className="notion-card notion-card-hover p-8 text-center group">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Image className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                配图建议
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                为文章推荐合适的配图，增强视觉效果和阅读体验
              </p>
            </div>
            
            <div className="notion-card notion-card-hover p-8 text-center group">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Wand2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                智能排版
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                自动优化文章结构、标题和关键词，提升SEO效果
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 