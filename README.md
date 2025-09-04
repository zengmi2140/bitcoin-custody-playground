# 比特币自主托管交互网站

## 📋 项目简介

这是一个基于现代Web技术构建的比特币自主托管交互式网站，帮助用户了解和学习比特币自主托管的各个组件及其相互关系。网站采用响应式设计，支持多种设备访问。

## 🚀 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite 5.4
- **样式框架**: TailwindCSS 4.1
- **开发语言**: TypeScript 4.9
- **包管理器**: npm

## ✨ 核心功能

### 🎯 交互式组件展示
- **硬件签名器**: 展示各种硬件钱包设备及其特性
- **软件钱包**: 展示不同平台的软件钱包解决方案
- **区块链节点**: 展示各种节点类型和配置选项

### 🔗 智能连接关系
- 动态显示组件间的兼容性关系
- 可视化数据流动路径
- 智能状态管理（活跃、呼吸、非活跃状态）

### 📱 响应式设计
- 支持桌面端、平板和移动设备
- 自适应布局，确保在各种屏幕尺寸下的最佳显示效果
- 触摸友好的交互设计

### 🎨 用户体验
- 初始引导界面，帮助用户快速上手
- 本地存储用户偏好设置
- 流畅的动画效果和状态转换

## 🛠️ 快速开始

### 环境要求
- Node.js 16.0 或更高版本
- npm 7.0 或更高版本

### 安装和运行

```bash
# 克隆项目
git clone [项目地址]
cd soft-hard-wallet

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

### 开发服务器
- 开发模式: `http://localhost:8083/`
- 支持热重载和快速刷新

## 📁 项目结构

```
soft-hard-wallet/
├── public/                 # 静态资源
│   ├── custody-data.json  # 托管数据配置
│   └── index.html         # HTML模板
├── src/                    # 源代码
│   ├── components/         # React组件
│   │   ├── Header.tsx     # 页面头部组件
│   │   ├── MainLayout.tsx # 主布局组件
│   │   ├── ComponentColumn.tsx # 组件列展示
│   │   └── InitialGuide.tsx   # 初始引导
│   ├── types.ts           # TypeScript类型定义
│   ├── data.ts            # 静态数据
│   ├── dataLoader.ts      # 数据加载器
│   ├── App.tsx            # 主应用组件
│   ├── main.tsx           # 应用入口
│   ├── index.css          # 全局样式
│   └── App.css            # 应用样式
├── dist/                   # 构建输出目录
├── package.json            # 项目配置
├── tailwind.config.js      # TailwindCSS配置
├── tsconfig.json           # TypeScript配置
└── vite.config.ts          # Vite配置
```

## 🎨 组件架构

### 核心组件

#### `App.tsx` - 主应用
- 管理全局状态
- 处理数据加载和用户偏好
- 协调各组件间的交互

#### `MainLayout.tsx` - 主布局
- 三列式布局设计
- 响应式网格系统
- 组件间的连接关系展示

#### `ComponentColumn.tsx` - 组件列
- 展示特定类型的组件（签名器、钱包、节点）
- 支持选择和状态管理
- 特性列表展示

#### `Header.tsx` - 页面头部
- 网站标题和导航
- 进度指示器
- 用户操作按钮

#### `InitialGuide.tsx` - 初始引导
- 用户偏好设置
- 设备类型选择
- 签名器使用意愿调查

### 数据流

```
用户偏好设置 → 组件状态计算 → 兼容性检查 → 视觉反馈
     ↓              ↓              ↓           ↓
localStorage → 状态管理 → 关系映射 → UI更新
```

## 🔧 配置说明

### TailwindCSS 配置
- 自定义颜色主题
- 响应式断点设置
- 组件样式定制

### TypeScript 配置
- 严格类型检查
- 模块解析配置
- 编译目标设置

### Vite 配置
- React 插件支持
- 开发服务器配置
- 构建优化设置

## 📱 响应式设计

### 断点设置
- **移动端**: `max-width: 768px`
- **平板端**: `min-width: 769px` 到 `max-width: 1024px`
- **桌面端**: `min-width: 1025px` 到 `max-width: 1600px`
- **大屏幕**: `min-width: 1601px`

### 布局适配
- 移动端：垂直堆叠布局
- 桌面端：三列并排布局
- 自适应间距和字体大小

## 🚀 部署

### 静态网站托管
```bash
# 构建项目
npm run build

# 部署到任意静态托管服务
# 如 GitHub Pages, Vercel, Netlify 等
```

### 本地预览
```bash
# 构建后本地预览
npm run preview
```

## 🔍 开发调试

### 浏览器兼容性
- 支持现代浏览器（Chrome, Firefox, Safari, Edge）
- 渐进式增强，确保基础功能可用

### 开发工具
- React Developer Tools
- TypeScript 类型检查
- Vite 热重载
- TailwindCSS 智能提示

## 📝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🤝 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 开启 Pull Request
- 项目讨论区

---

**注意**: 这是一个教育性质的演示项目，展示了比特币自主托管的各个组件和概念。在实际使用中，请确保遵循安全最佳实践。