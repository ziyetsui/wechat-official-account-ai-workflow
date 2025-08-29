# 公众号排版规范指南 v1.3 - 全文排版版本

## 概述

本文档详细说明了公众号文章的全文排版规范，包括字体、层级、排版元素和特殊模块的配置。**重要：必须对整篇文章的每一个部分都进行排版处理，不能遗漏任何内容。**

## 字体与层级规范

### 大标题 / 章节编号
- **字体大小**: 36px
- **对齐方式**: 居中对齐
- **字重**: 粗体
- **样式**: 斜体
- **颜色**: rgb(238, 84, 8)
- **字体族**: "PingFang SC", system-ui, -apple-system, "Helvetica Neue", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif

### 小节标题
- **字体大小**: 20px
- **对齐方式**: 居中对齐
- **字重**: 粗体
- **颜色**: rgb(238, 84, 8)
- **字体族**: "PingFang SC", system-ui, -apple-system, "Helvetica Neue", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif

### 正文
- **字体大小**: 15px
- **行高**: 1.75em
- **字间距**: 0.544px
- **上下边距**: 0.8em
- **颜色**: #4e4e4e
- **字体族**: "PingFang SC", system-ui, -apple-system, "Helvetica Neue", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif

### 居中正文
- **字体大小**: 15px
- **行高**: 1.75em
- **字间距**: 0.544px
- **上下边距**: 0.8em
- **颜色**: #4e4e4e
- **对齐方式**: 居中对齐
- **字体族**: "PingFang SC", system-ui, -apple-system, "Helvetica Neue", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif

## 排版元素

### 分割线
- **样式**: 简洁细黑线（水平线，视觉压缩高度更细，左右延伸）
- **CSS类**: hr-line
- **CSS样式**: 
  ```css
  border-top: 1px solid rgba(0,0,0,0.1);
  transform: scaleY(0.5);
  transform-origin: 0 0;
  ```

### 强调样式
- **方式**: 高亮
- **颜色**: rgb(238, 84, 8)
- **用途**: 关键句或关键词

## 特殊模块

### 文章开头提示区
- **符号**: ▲
- **样式**: 蓝红高亮文字
- **作用**: 引导读者

### 章节格式
#### 编号
- **字体大小**: 36px
- **字重**: 粗体
- **样式**: 斜体
- **颜色**: rgb(238, 84, 8)

#### 小标题
- **字体大小**: 20px
- **字重**: 粗体
- **颜色**: rgb(238, 84, 8)

## 全文排版工作流程

1. **接收原始文章**
2. **在开头添加提示区**（▲符号 + 引导文字）
3. **识别文章结构，添加章节编号**
4. **按照章节编号 + 小标题结构，插入分割线**
5. **为大标题、小节标题、正文、居中正文、关键句应用对应样式**
6. **处理所有段落、列表、引用等元素**
7. **确保每个文本元素都有正确的样式**
8. **输出完整的排版结果（HTML格式）**

## 全文排版要求

1. **必须对整篇文章进行排版**：包括标题、正文、段落、列表等所有内容
2. 输出文章必须使用HTML格式（适配公众号后台）
3. 不能遗漏任何段落内容，确保原文的完整性
4. 不得随意更改原文内容，允许自动优化分段，使排版更美观
5. 使用标准的HTML标签，如`<p>`、`<h1>`、`<h2>`、`<h3>`、`<span>`、`<div>`、`<ul>`、`<li>`等
6. 使用内联样式或CSS类来应用颜色和字体样式
7. 所有文本元素必须遵循统一字体、行高、字间距、对齐和颜色规范
8. 大标题、小节标题和强调样式都使用rgb(238, 84, 8)颜色
9. 为文章添加适当的章节编号和分割线
10. 识别并高亮关键句或关键词

## 排版检查清单

- [ ] 文章开头提示区已添加
- [ ] 所有标题都已应用正确样式
- [ ] 所有正文段落都已格式化
- [ ] 关键句和关键词已高亮
- [ ] 章节编号和分割线已添加
- [ ] 所有文本元素都有统一的字体和颜色
- [ ] 没有遗漏任何原文内容
- [ ] 输出格式为HTML，适配公众号后台

## 示例

### 原始文本
```
人工智能在医疗领域的应用

随着技术的不断发展，人工智能在医疗领域的应用越来越广泛。

诊断辅助
AI可以通过分析医学影像，帮助医生更准确地诊断疾病。

药物研发
在药物研发过程中，AI可以加速分子筛选和临床试验设计。
```

### 格式化后
```html
<div style="text-align: center; color: rgb(238, 84, 8); font-size: 36px; font-weight: bold; font-style: italic; font-family: 'PingFang SC', system-ui, -apple-system, 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif;">
  人工智能在医疗领域的应用
</div>

<p style="font-size: 15px; line-height: 1.75em; letter-spacing: 0.544px; margin: 0.8em 0 0; color: #4e4e4e; font-family: 'PingFang SC', system-ui, -apple-system, 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif;">
  随着技术的不断发展，<span style="color: rgb(238, 84, 8);">人工智能在医疗领域的应用</span>越来越广泛。
</p>

<div style="text-align: center; color: rgb(238, 84, 8); font-size: 20px; font-weight: bold; font-family: 'PingFang SC', system-ui, -apple-system, 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif;">
  诊断辅助
</div>

<p style="font-size: 15px; line-height: 1.75em; letter-spacing: 0.544px; margin: 0.8em 0 0; color: #4e4e4e; font-family: 'PingFang SC', system-ui, -apple-system, 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif;">
  AI可以通过分析医学影像，帮助医生更准确地诊断疾病。
</p>

<div style="text-align: center; color: rgb(238, 84, 8); font-size: 20px; font-weight: bold; font-family: 'PingFang SC', system-ui, -apple-system, 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif;">
  药物研发
</div>

<p style="font-size: 15px; line-height: 1.75em; letter-spacing: 0.544px; margin: 0.8em 0 0; color: #4e4e4e; font-family: 'PingFang SC', system-ui, -apple-system, 'Helvetica Neue', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif;">
  在药物研发过程中，AI可以加速分子筛选和临床试验设计。
</p>
```

## 更新日志

- **v1.3 全文排版版本**: 强调全文排版要求，更新小标题颜色为rgb(238, 84, 8)，增加排版检查清单
- **v1.3**: 更新大标题颜色为rgb(238, 84, 8)，强调样式颜色统一，增加大标题样式规范
- **v1.2**: 更新了详细的字体与层级规范，增加了精确的排版元素配置
- **v1.1**: 添加了特殊模块的样式定义
- **v1.0**: 初始版本，基础排版规范
