const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  try {
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
    
    await handle(req, res)
    
    return {
      statusCode: res.statusCode,
      headers: {
        ...headers,
        ...res.headers
      },
      body: res.body
    }
  } catch (error) {
    console.error('Publish API Error:', error)
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal Server Error',
        message: error.message
      })
    }
  }
}
