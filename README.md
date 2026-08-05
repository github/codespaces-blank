# ToDo Electron App / ToDo 电子清单应用

[English](#english) | [中文](#中文)

---

## English

A Windows To-Do List application built with Electron, React, and Vite.

### Features / 功能

- **Categories** — Organize tasks with color-coded categories / **分类** — 用彩色分类组织任务
- **Due Dates** — Set deadlines with visual overdue indicators / **截止日期** — 设置截止日期，带过期视觉提示
- **Search & Filter** — Find tasks quickly with search, status, and due date filters / **搜索与筛选** — 支持搜索、状态筛选和截止日期筛选
- **Sort** — Sort by created date, due date, or alphabetically / **排序** — 按创建时间、截止日期或字母排序
- **Undo Delete** — Accidentally deleted a task? Undo within 3 seconds / **撤销删除** — 误删任务？3秒内可撤销
- **Windows Notifications** — Get notified about overdue tasks on launch / **Windows 通知** — 启动时通知过期任务

### Tech Stack / 技术栈

- Electron 33 + Vite 5 + React 18
- TypeScript, Tailwind CSS 3
- electron-store (native persistence to `%APPDATA%`)
- Electron Forge (packaging)

### Development / 开发

```bash
# Install dependencies / 安装依赖
npm install

# Run in development mode with HMR / 开发模式运行
npm run dev

# Run tests / 运行测试
npm test

# Build for Windows / 构建 Windows 版本
npm run build

# Package for Windows / 打包 Windows 版本
npm run package
```

### GitHub Actions / GitHub 操作

Two workflows are available:

1. **build-windows** — runs on push to `main`, builds the app and uploads the `.exe` as an artifact
2. **release-windows** — manual trigger to create a GitHub Release with the packaged installer

**How to download the build artifact:**
1. Go to the [Actions tab](https://github.com/awavagcu/codespaces-blank/actions)
2. Click on the latest workflow run
3. Scroll down to the **Artifacts** section
4. Click `todolist-windows-x64` to download the zip

### Project Structure / 项目结构

```
todolist-electron/
├── electron/
│   ├── main.ts          # 主进程：数据存储、IPC、窗口管理
│   └── preload.ts       # 预加载脚本：IPC 桥接
├── src/
│   ├── App.tsx          # 根组件
│   ├── main.tsx         # React 入口
│   ├── types.ts         # TypeScript 接口定义
│   ├── store/
│   │   └── useStore.ts  # electron-store React Context
│   ├── lib/
│   │   └── filterSort.ts # 筛选和排序逻辑
│   └── components/      # React 组件
├── .github/workflows/   # CI/CD 工作流
└── docs/superpowers/    # 设计文档和计划
```

---

## 中文

基于 Electron、React 和 Vite 构建的 Windows 待办事项清单应用。

### 功能特性

- **分类管理**：用颜色编码的分类组织任务，支持创建/编辑/删除分类
- **截止日期**：设置任务截止日期，带视觉过期提示（红色=过期，黄色=今天）
- **搜索与筛选**：支持标题/描述搜索，按状态、分类、截止日期筛选，支持多种排序方式
- **撤销删除**：删除任务后有3秒撤销窗口
- **Windows 通知**：启动时检查过期任务并发送系统通知
- **原生持久化**：数据存储在 `%APPDATA%/com.todolist/app.json`

### 技术栈

- Electron 33 + Vite 5 + React 18
- TypeScript 5, Tailwind CSS 3
- electron-store（原生数据持久化）
- Electron Forge（Windows .exe 打包）

### 开发指南

```bash
# 安装依赖
npm install

# 开发模式运行（带热更新）
npm run dev

# 运行测试
npm test

# 构建生产版本
npm run build

# 打包为 Windows 应用
npm run package
```

### GitHub Actions 构建

项目配置了两个工作流：

1. **build-windows** — 推送到 `main` 分支时自动触发，构建应用并上传 `.exe` 作为制品
2. **release-windows** — 手动触发，创建 GitHub Release 并发布安装包

**如何下载构建产物：**
1. 进入 [Actions 页面](https://github.com/awavagcu/codespaces-blank/actions)
2. 点击最新的一次 workflow 运行
3. 向下滚动到 **Artifacts**（制品）区域
4. 点击 `todolist-windows-x64` 下载压缩包

### 项目结构

见上方英文部分的项目结构。

---

## Testing / 测试

```
Test Files: 11 passed
Tests:      58 passed
```
