# 🎨 dadandiaoming-cli

一个功能强大的脚手架工具，支持快速创建 Vue3 和 React 项目模板。让项目创建变得简单而优雅！ ✨

## ✨ 特性

- 🚀 支持 Vue3 和 React 项目模板
- 📦 基于 TypeScript 开发，提供完整的类型支持
- 🎨 交互式命令行界面，操作简单直观
- ⚡️ 快速创建项目，提高开发效率
- 🛠️ 支持模板定制，满足不同开发需求
- 🔥 热更新开发体验
- 🎯 零配置，开箱即用

## 📦 安装

```bash
npm install -g dadandiaoming-cli
```
## 🚀 快速开始
### 🛠️ 命令行选项
- 📊 -v, --version : 显示版本号
- 🎯 create [project-name] : 创建新项目
- 🔄 update : 更新脚手架到最新版本
- 📦 package (pkg) : 包管理工具安装与配置
### 1️⃣ 创建新项目
```bash
dadandiaoming create <project-name>
```
💡 如果不提供项目名称，将会提示您输入。

### 2️⃣ 交互式创建
只需三步，轻松创建项目：

1. 运行创建命令：
```bash
dadandiaoming create
```
2. 📝 按提示输入项目名称
3. 🎯 选择项目模板（Vue/React）
4. ⏳ 等待项目创建完成

## 📚 可用模板
### 🟢 Vue 模板
- 📌 名称：vue
- 📝 描述：基于 Vue3 的项目模板
- ✨ 特性：
  - 🔥 基于 Vue3 + TypeScript
  - 📦 包含完整的项目结构
  - 🛠️ 集成常用开发工具
  - 🎨 支持 CSS 预处理器
  - 📱 响应式设计支持
### ⚛️ React 模板
- 📌 名称：react
- 📝 描述：基于 React 的项目模板
- ✨ 特性：
  - 🔥 基于最新的 React 技术栈
  - 📦 TypeScript 支持
  - 🛠️ 现代化的开发配置
  - 🎨 样式解决方案集成
  - 📱 移动端适配支持

### 📦 包管理工具配置
使用 `package` 命令（或简写 `pkg`）可以快速安装和配置常用的包管理工具：

```bash
dadandiaoming package
# 或使用简写
dadandiaoming pkg
```
该命令会引导您选择要安装的包管理工具并设置淘宝镜像(含`npm`)：
- 📦 yarn
- 📦 pnpm

## ⚡️ 开发流程
1. 📂 进入项目目录：
```bash
cd <project-name>
```
2. 📦 安装依赖：
```bash
npm install
# 或者使用
pnpm install
```
3. 🚀 启动开发服务器：
```bash
npm run dev
```
## ⚠️ 注意事项
- 💻 确保已安装 Node.js（推荐 v18 或更高版本）
- 🌐 确保有稳定的网络连接，因为需要从远程仓库克隆模板
- 🔒 如果项目创建失败，请检查网络连接和目标目录权限

## 📄 许可证
ISC License

## 👨‍💻 作者
dadandiaoming
