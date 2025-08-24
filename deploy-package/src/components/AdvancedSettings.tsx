'use client'

import React, { useState } from 'react'
import { Settings, ChevronDown, ChevronUp, Target, Users, FileText } from 'lucide-react'

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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center">
          <Settings className="w-5 h-5 mr-2 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            高级设置
          </h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-6 space-y-6">
          {/* 目标受众 */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Target className="w-4 h-4 mr-2" />
              目标受众
            </label>
            <select
              value={settings.targetAudience}
              onChange={(e) => handleChange('targetAudience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="产品经理、创业者、营销人员、对AIGC应用落地感兴趣的人">
                产品经理、创业者、营销人员、对AIGC应用落地感兴趣的人
              </option>
              <option value="企业管理者、决策者、商业分析师">
                企业管理者、决策者、商业分析师
              </option>
              <option value="技术从业者、开发者、IT管理者">
                技术从业者、开发者、IT管理者
              </option>
              <option value="普通用户、消费者、对新技术感兴趣的人">
                普通用户、消费者、对新技术感兴趣的人
              </option>
            </select>
          </div>

          {/* 内容长度 */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <FileText className="w-4 h-4 mr-2" />
              内容长度
            </label>
            <select
              value={settings.contentLength}
              onChange={(e) => handleChange('contentLength', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="3000-4000字">3000-4000字（推荐）</option>
              <option value="2000-3000字">2000-3000字</option>
              <option value="4000-5000字">4000-5000字</option>
              <option value="1500-2000字">1500-2000字</option>
            </select>
          </div>

          {/* 写作风格 */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Users className="w-4 h-4 mr-2" />
              写作风格
            </label>
            <select
              value={settings.writingStyle}
              onChange={(e) => handleChange('writingStyle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="刘润风格">刘润风格（推荐）</option>
              <option value="吴晓波风格">吴晓波风格</option>
              <option value="罗振宇风格">罗振宇风格</option>
              <option value="李笑来风格">李笑来风格</option>
              <option value="通用商业风格">通用商业风格</option>
            </select>
          </div>

          {/* 内容元素 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              内容元素
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.includeExamples}
                  onChange={(e) => handleChange('includeExamples', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  包含具体案例和例子
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.includeStories}
                  onChange={(e) => handleChange('includeStories', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  包含故事和场景描述
                </span>
              </label>
            </div>
          </div>

          {/* 提示信息 */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 这些设置将影响AI生成内容的风格和质量。建议根据您的具体需求进行调整。
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 