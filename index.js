// index.js
const express = require("express");
const app = express();

// 添加CORS支持
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 解析JSON请求体
app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello, World!" });
});

// 添加更多API端点
app.get("/api/status", (req, res) => {
  res.json({ 
    status: "running", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.post("/api/echo", (req, res) => {
  res.json({ 
    message: "Echo response", 
    data: req.body,
    timestamp: new Date().toISOString()
  });
});

// 监听 3001 端口（避免与Next.js冲突）
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Express API server running at http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  GET  http://localhost:${PORT}/api/hello`);
  console.log(`  GET  http://localhost:${PORT}/api/status`);
  console.log(`  POST http://localhost:${PORT}/api/echo`);
});
