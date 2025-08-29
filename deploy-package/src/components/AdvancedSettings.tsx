'use client'

import React, { useState } from 'react'
import { Settings, ChevronDown, ChevronUp, Target, Users, FileText, Clock, Palette, CheckSquare, Square } from 'lucide-react'

interface AdvancedSettingsProps {
  settings: {
    targetAudience: string
    contentLength: string
    writingStyle: string
    includeExamples: boolean
    includeStories: boolean
  }
  onSettingsChange: (settings: any) => void
}

export default function AdvancedSettings({ settings, onSettingsChange }: AdvancedSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleChange = (key: string, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    })
  }

  return (
    <div className="notion-card notion-card-hover p-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left group"
      >
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-3 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              高级设置
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              自定义内容生成参数
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-6 space-y-6 animate-fade-in">
          {/* 目标受众 */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <Users className="w-4 h-4 mr-2 text-blue-500" />
              目标受众
            </label>
            <input
              type="text"
              value={settings.targetAudience}
              onChange={(e) => handleChange('targetAudience', e.target.value)}
              className="notion-input"
              placeholder="例如：产品经理、创业者、营销人员"
            />
          </div>

          {/* 内容长度 */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <Clock className="w-4 h-4 mr-2 text-green-500" />
              内容长度
            </label>
            <select
              value={settings.contentLength}
              onChange={(e) => handleChange('contentLength', e.target.value)}
              className="notion-input"
            >
              <option value="1000-1500字">1000-1500字</option>
              <option value="2000-2500字">2000-2500字</option>
              <option value="3000-4000字">3000-4000字</option>
              <option value="5000-6000字">5000-6000字</option>
            </select>
          </div>

          {/* 写作风格 */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <Palette className="w-4 h-4 mr-2 text-purple-500" />
              写作风格
            </label>
            <select
              value={settings.writingStyle}
              onChange={(e) => handleChange('writingStyle', e.target.value)}
              className="notion-input"
            >
              <option value="刘润风格">刘润风格</option>
              <option value="罗振宇风格">罗振宇风格</option>
              <option value="吴晓波风格">吴晓波风格</option>
              <option value="李笑来风格">李笑来风格</option>
              <option value="专业学术">专业学术</option>
              <option value="轻松幽默">轻松幽默</option>
            </select>
          </div>

          {/* 内容元素 */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <FileText className="w-4 h-4 mr-2 text-orange-500" />
              内容元素
            </label>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer group">
                <div className="mr-3">
                  {settings.includeExamples ? (
                    <CheckSquare className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  )}
                </div>
                <span 
                  className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
                  onClick={() => handleChange('includeExamples', !settings.includeExamples)}
                >
                  包含实际案例
                </span>
              </label>
              
              <label className="flex items-center cursor-pointer group">
                <div className="mr-3">
                  {settings.includeStories ? (
                    <CheckSquare className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  )}
                </div>
                <span 
                  className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
                  onClick={() => handleChange('includeStories', !settings.includeStories)}
                >
                  包含故事和比喻
                </span>
              </label>
            </div>
          </div>

          {/* 设置说明 */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 这些设置将影响AI生成内容的风格和结构。您可以根据目标受众和内容需求进行调整。
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 