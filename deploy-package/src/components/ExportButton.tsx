'use client'

import React from 'react'
import { Download } from 'lucide-react'

interface ExportButtonProps {
  content: {
    content: string
    titles: string[]
    imageSuggestions: string
  }
  topic: string
}

export default function ExportButton({ content, topic }: ExportButtonProps) {
  const handleExport = () => {
    const exportData = {
      topic,
      generatedAt: new Date().toLocaleString('zh-CN'),
      content: content.content,
      titles: content.titles,
      imageSuggestions: content.imageSuggestions
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wechat-article-${topic}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExportText = () => {
    const textContent = `
微信公众号文章内容

主题：${topic}
生成时间：${new Date().toLocaleString('zh-CN')}

=== 文章内容 ===
${content.content}

=== 标题建议 ===
${content.titles.map((title, index) => `${index + 1}. ${title}`).join('\n')}

=== 配图建议 ===
${content.imageSuggestions}
    `.trim()

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wechat-article-${topic}-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleExport}
        className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
      >
        <Download className="w-4 h-4 mr-2" />
        导出JSON
      </button>
      <button
        onClick={handleExportText}
        className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        <Download className="w-4 h-4 mr-2" />
        导出文本
      </button>
    </div>
  )
} 