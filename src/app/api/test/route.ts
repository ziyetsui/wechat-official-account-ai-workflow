import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  try {
    // 检查环境变量
    const envCheck = {
      AZURE_OPENAI_BASE_URL: !!process.env.AZURE_OPENAI_BASE_URL,
      AZURE_OPENAI_API_KEY: !!process.env.AZURE_OPENAI_API_KEY,
      AZURE_OPENAI_API_VERSION: !!process.env.AZURE_OPENAI_API_VERSION,
      AZURE_OPENAI_MODEL_NAME: !!process.env.AZURE_OPENAI_MODEL_NAME,
      NODE_ENV: process.env.NODE_ENV,
    }

    return NextResponse.json({
      success: true,
      message: 'API测试成功',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      headers: Object.fromEntries(request.headers.entries())
    }, { headers })

  } catch (error) {
    console.error('测试API错误:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString()
    }, { 
      status: 500,
      headers 
    })
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
