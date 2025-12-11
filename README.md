# 比特币自主保管模拟器

一个基于 React + TypeScript + Vite 的静态站点，帮助用户了解硬件签名器、软件钱包、区块链节点的组合与数据流。支持桌面与移动端的响应式体验。

## 技术栈
- React 18 + TypeScript
- Vite 5
- TailwindCSS 3

## 核心功能
- 三列布局：硬件签名器 / 软件钱包 / 区块链节点
- 组件状态与兼容关系展示，含连接方式提示
- 初始引导与完成度进度条
- 响应式布局与基础动画

## 快速开始
```bash
npm install
npm run dev   # 默认端口 8080
npm run build
npm run preview
```

## 目录概览
```
soft-hard-wallet/
├── public/                # 静态资源与数据文件
│   └── custody-data.json  # 站点使用的数据
├── src/                   # 前端源码
│   ├── components/        # UI 组件
│   ├── content/           # FAQ 等文档内容
│   ├── data.ts            # 备用数据
│   ├── dataLoader.ts      # 数据加载与回退逻辑
│   └── main.tsx           # 入口
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── LICENSE
```

## 注意事项
- Logo 及品牌素材位于 `public/images/logos/`，请确保你的使用符合对应品牌的授权要求。
- 本仓库为静态前端站点，如需自定义数据，可直接修改 `public/custody-data.json`。

## 许可证
本项目采用 MIT 许可证，详见 `LICENSE` 文件。
