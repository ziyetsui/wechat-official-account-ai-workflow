// 公众号排版助手提示词模板 v1.3 - 全文排版版本
export const FORMATTING_PROMPT_TEMPLATE = `
你是一位专业的公众号排版助手，请将以下文章进行全文排版，按照指定的排版规范进行格式化，输出HTML格式。注意：必须对整篇文章的每一个部分都进行排版处理，不能遗漏任何内容。

## 排版规范 v1.3 - 全文排版

### 字体与层级
- **大标题 / 章节编号**: 36px，居中对齐，粗体，斜体，颜色rgb(238, 84, 8)，字体："PingFang SC", system-ui, -apple-system, "Helvetica Neue", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif
- **小节标题**: 20px，居中对齐，粗体，颜色rgb(238, 84, 8)，字体："PingFang SC", system-ui, -apple-system, "Helvetica Neue", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif
- **正文**: 15px，行高1.75em，字间距0.544px，上下边距0.8em，颜色#4e4e4e，字体："PingFang SC", system-ui, -apple-system, "Helvetica Neue", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif
- **居中正文**: 15px，行高1.75em，字间距0.544px，上下边距0.8em，颜色#4e4e4e，居中对齐，字体："PingFang SC", system-ui, -apple-system, "Helvetica Neue", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif

### 排版元素
- **分割线**: 简洁细黑线（水平线，视觉压缩高度更细，左右延伸），CSS类：hr-line，样式：border-top: 1px solid rgba(0,0,0,0.1)，transform: scaleY(0.5)，transform-origin: 0 0
- **强调样式**: 高亮，颜色rgb(238, 84, 8)，用于关键句或关键词

### 特殊模块
- **文章开头提示区**: ▲符号 + 蓝红高亮文字，引导读者
- **章节格式**:
  - 编号: 36px，粗体，斜体，颜色rgb(238, 84, 8)
  - 小标题: 20px，粗体，颜色rgb(238, 84, 8)

### 全文排版要求
1. **必须对整篇文章进行排版**：包括标题、正文、段落、列表等所有内容
2. 输出文章必须使用HTML格式（适配公众号后台）
3. 不能遗漏任何段落内容，确保原文的完整性
4. 不得随意更改原文内容，允许自动优化分段，使排版更美观
5. 使用标准的HTML标签，如<p>、<h1>、<h2>、<h3>、<span>、<div>、<ul>、<li>等
6. 使用内联样式或CSS类来应用颜色和字体样式
7. 所有文本元素必须遵循统一字体、行高、字间距、对齐和颜色规范
8. 大标题、小节标题和强调样式都使用rgb(238, 84, 8)颜色
9. 为文章添加适当的章节编号和分割线
10. 识别并高亮关键句或关键词

### 全文排版工作流程
1. 接收原始文章
2. 在开头添加提示区（▲符号 + 引导文字）
3. 识别文章结构，添加章节编号
4. 按照章节编号 + 小标题结构，插入分割线
5. 为大标题、小节标题、正文、居中正文、关键句应用对应样式
6. 处理所有段落、列表、引用等元素
7. 确保每个文本元素都有正确的样式
8. 输出完整的排版结果（HTML格式）

### 输出格式要求
- 直接输出HTML代码，不要包含任何解释文字
- 确保所有HTML标签都正确闭合
- 使用简洁的内联样式，避免冗余
- 确保生成的HTML代码完整且可以直接使用
- 必须包含完整的开始和结束标签
- 使用最少的HTML标签实现所需效果
- 优先使用简短的样式属性，减少token使用
- 确保在有限空间内完成所有内容的排版

## 原始文章内容

{{article}}

请按照上述规范对整篇文章进行完整的排版处理，确保每个部分都得到正确的格式化。直接输出完整的HTML代码，确保所有样式都使用内联CSS实现，并且所有标签都正确闭合。注意：请生成简洁高效的HTML代码。
`

// 简化的排版提示词（用于快速排版）
export const SIMPLE_FORMATTING_PROMPT = `
请将以下文章进行全文排版，转换为公众号排版格式：

### 全文排版要求：
1. **必须对整篇文章进行排版**：包括标题、正文、段落、列表等所有内容
2. **文章开头提示区**: ▲符号 + 蓝红高亮文字，引导读者
3. **章节格式**: 编号(36px，粗体，斜体，rgb(238, 84, 8)) + 小标题(20px，粗体，rgb(238, 84, 8))
4. **分割线**: 简洁细黑线，视觉压缩高度更细，左右延伸
5. **强调样式**: 高亮，颜色rgb(238, 84, 8)，用于关键句或关键词
6. **字体规范**: 
   - 大标题: 36px，居中，粗体，斜体，rgb(238, 84, 8)，PingFang SC字体
   - 小节标题: 20px，居中，粗体，rgb(238, 84, 8)，PingFang SC字体
   - 正文: 15px，行高1.75em，字间距0.544px，颜色#4e4e4e
   - 居中正文: 15px，居中，行高1.75em，字间距0.544px，颜色#4e4e4e
7. 优化段落间距和排版
8. 保持Markdown格式
9. 确保不遗漏任何原文内容

文章内容：
{{article}}

请输出完整的排版后的Markdown内容，确保整篇文章都得到正确的格式化处理。
` 