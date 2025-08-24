'use client'

import React, { useState } from 'react'
import { Bot, FileText, Image, Send, Sparkles, Type, Wand2 } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Bot className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              微信公众号AI助手
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            使用AI技术提升公众号内容创作效率
          </p>
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                    <Sparkles className="w-6 h-6 inline mr-2 text-blue-500" />
                    内容生成
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        文章主题
                      </label>
                      <textarea
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="请输入文章主题或关键词..."
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                        rows={4}
                      />
                    </div>
                    
                    <button
                      onClick={handleGenerateContent}
                      disabled={isGenerating || !topic.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
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

                {/* 高级设置 */}
                <AdvancedSettings 
                  settings={advancedSettings}
                  onSettingsChange={setAdvancedSettings}
                />
              </div>
            </div>

            {/* Output Section */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                  <FileText className="w-6 h-6 inline mr-2 text-green-500" />
                  生成结果
                </h2>
                
                {error && (
                  <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}
                
                <div className="min-h-[400px]">
                  {generatedContent ? (
                    <div>
                      {/* 标签页导航 */}
                      <div className="flex space-x-1 mb-6 border-b border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => setActiveTab('content')}
                          className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                            activeTab === 'content'
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          <FileText className="w-4 h-4 inline mr-2" />
                          文章内容
                        </button>
                        <button
                          onClick={() => setActiveTab('titles')}
                          className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                            activeTab === 'titles'
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          <Type className="w-4 h-4 inline mr-2" />
                          标题建议
                        </button>
                        <button
                          onClick={() => setActiveTab('images')}
                          className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                            activeTab === 'images'
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          <Image className="w-4 h-4 inline mr-2" />
                          配图建议
                        </button>
                      </div>

                      {/* 内容显示 */}
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        {activeTab === 'content' && (
                          <div className="prose prose-lg max-w-none dark:prose-invert">
                            <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 font-sans leading-relaxed">
                              {generatedContent.content}
                            </pre>
                          </div>
                        )}
                        
                        {activeTab === 'titles' && (
                          <div className="space-y-3">
                            {generatedContent.titles.map((title, index) => (
                              <div key={index} className="p-3 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500">
                                <p className="text-gray-800 dark:text-gray-200 font-medium">{title}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {activeTab === 'images' && (
                          <div className="prose prose-lg max-w-none dark:prose-invert">
                            <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 font-sans leading-relaxed">
                              {generatedContent.imageSuggestions}
                            </pre>
                          </div>
                        )}
                      </div>

                      {/* 操作按钮 */}
                      <div className="mt-4 flex space-x-3">
                        <ExportButton content={generatedContent} topic={topic} />
                        <button 
                          onClick={() => setGeneratedContent(null)}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        >
                          重新生成
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                      <div className="text-center">
                        <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>输入主题后点击生成按钮开始创作</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              功能特色
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  AI内容生成
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  基于主题智能生成高质量的文章内容，提升创作效率
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  配图建议
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  为文章推荐合适的配图，增强视觉效果和阅读体验
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  智能优化
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  自动优化文章结构、标题和关键词，提升SEO效果
                </p>
              </div>
            </div>
            
            {/* 排版工具链接 */}
            <div className="mt-12 text-center">
              <Link 
                href="/format" 
                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                文章排版工具
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 