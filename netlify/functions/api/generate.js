const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

exports.handler = async (event, context) => {
  // 创建模拟的HTTP请求对象
  const url = parse(event.path, true)
  const { query } = url
  
  const req = {
    url: event.path,
    method: event.httpMethod,
    headers: event.headers,
    query,
    body: event.body ? JSON.parse(event.body) : {}
  }
  
  const res = {
    statusCode: 200,
    headers: {},
    body: '',
    setHeader: (name, value) => {
      res.headers[name] = value
    },
    end: (body) => {
      res.body = body
    }
  }
  
  try {
    await handle(req, res)
    
    return {
      statusCode: res.statusCode,
      headers: {
        'Content-Type': 'application/json',
        ...res.headers
      },
      body: res.body
    }
  } catch (error) {
    console.error('API Error:', error)
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: 'Internal Server Error'
      })
    }
  }
}
