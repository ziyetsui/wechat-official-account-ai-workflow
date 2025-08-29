import { NextRequest, NextResponse } from 'next/server'

// 环境变量检查函数
function checkEnvironmentVariables() {
  const requiredVars = [
    'GEMINI_API_KEY',
    'GEMINI_BASE_URL'
  ]
  
  const missingVars = requiredVars.filter(varName => !process.env[varName])
  
  return {
    allConfigured: missingVars.length === 0,
    missing: missingVars,
    configured: requiredVars.reduce((acc, varName) => {
      acc[varName] = process.env[varName] ? '已配置' : '未配置'
      return acc
    }, {} as Record<string, string>)
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('=== 健康检查开始 ===')
    
    const envCheck = checkEnvironmentVariables()
    const timestamp = new Date().toISOString()
    
    const healthStatus = {
      status: 'ok',
      timestamp,
      environment: process.env.NODE_ENV || 'unknown',
      version: process.env.npm_package_version || 'unknown',
      envCheck,
      deployment: {
        platform: 'vercel',
        region: process.env.VERCEL_REGION || 'unknown',
        url: process.env.VERCEL_URL || 'unknown'
      }
    }
    
    // 如果环境变量配置不完整，返回警告状态
    if (!envCheck.allConfigured) {
      healthStatus.status = 'warning'
      console.warn('环境变量配置不完整:', envCheck.missing)
    }
    
    console.log('=== 健康检查完成 ===')
    
    return NextResponse.json(healthStatus, {
      status: envCheck.allConfigured ? 200 : 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
    
  } catch (error) {
    console.error('=== 健康检查异常 ===')
    console.error('错误详情:', error)
    
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString()
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  }
}

