# 比特币自主托管交互网站 - 移植指南

## 📋 项目信息
- **技术栈**: React + TypeScript
- **构建工具**: Create React App
- **依赖管理**: npm

## 🚀 快速开始

### 1. 环境要求
- Node.js 16+ 
- npm 或 yarn

### 2. 安装步骤
```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 构建生产版本
npm run build
```

### 3. 目录结构
```
bitcoin-custody-website/
├── public/          # 静态文件
├── src/             # 源代码
│   ├── components/  # React组件
│   ├── types.ts     # TypeScript类型定义
│   ├── data.ts      # 组件数据
│   └── App.tsx      # 主应用组件
├── build/           # 构建输出（运行npm run build后生成）
└── package.json     # 项目配置
```

## 📝 在不同编辑器中使用

### VS Code
1. File -> Open Folder -> 选择项目文件夹
2. 安装推荐插件：ES7+ React/Redux/React-Native snippets
3. 终端中运行 `npm install` 和 `npm start`

### WebStorm/IntelliJ IDEA
1. File -> Open -> 选择项目文件夹
2. WebStorm会自动识别React项目
3. 使用内置终端运行npm命令

### Sublime Text
1. File -> Open Folder -> 选择项目文件夹
2. 安装Package Control和React相关插件
3. 使用外部终端运行npm命令

### Atom
1. File -> Add Project Folder -> 选择项目文件夹
2. 安装相关React语法高亮插件
3. 使用终端面板运行npm命令

## 🌐 部署选项

### 静态网站托管
- **GitHub Pages**: 免费托管
- **Vercel**: 一键部署
- **Netlify**: 支持持续集成

### 本地服务器
```bash
# 全局安装serve
npm install -g serve

# 运行生产版本
serve -s build
```

## 🔧 自定义配置

项目使用标准的Create React App配置，支持：
- TypeScript
- CSS Modules
- 热重载
- 自动代码分割

## 📞 技术支持

如果在移植过程中遇到问题：
1. 确认Node.js版本 >= 16
2. 清除npm缓存: `npm cache clean --force`
3. 删除node_modules并重新安装: `rm -rf node_modules && npm install`

---
项目已配置完整的开发环境，可以直接在任何支持React的编辑器中使用。