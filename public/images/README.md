# Logo图片管理说明

## 📁 目录结构
```
public/images/
├── logos/
│   ├── hardware/     # 硬件签名器Logo
│   ├── software/     # 软件钱包Logo
│   └── nodes/        # 区块链节点Logo
└── icons/            # 其他图标
```

## 🎨 图片规范

### 文件格式
- **推荐格式**: PNG（支持透明背景）
- **备选格式**: SVG（矢量图，可缩放）
- **尺寸建议**: 64x64px 或 128x128px
- **文件大小**: 建议小于50KB

### 命名规范
- 使用小写字母和连字符
- 例如：`trezor.png`, `cold-card.png`, `sparrow-wallet.png`

### 分类存储
- **硬件签名器**: `public/images/logos/hardware/`
- **软件钱包**: `public/images/logos/software/`
- **区块链节点**: `public/images/logos/nodes/`

## 🔗 Airtable中的Logo字段格式

在Airtable的Components表中，Logo字段应填写相对路径：

```
# 硬件签名器示例
/images/logos/hardware/trezor.png
/images/logos/hardware/coldcard.png

# 软件钱包示例
/images/logos/software/sparrow.png
/images/logos/software/electrum.png

# 区块链节点示例
/images/logos/nodes/bitcoin-core.png
```

## ⚠️ 注意事项

1. **路径格式**: 必须以 `/images/logos/` 开头
2. **文件存在**: 脚本会验证图片文件是否存在
3. **默认Logo**: 如果文件不存在，会使用默认Logo
4. **版本控制**: 图片文件会随代码一起提交到Git

## 🚀 工作流程

1. **准备图片**: 下载或制作Logo图片
2. **放置文件**: 将图片放到对应目录
3. **更新Airtable**: 在Logo字段填入相对路径
4. **运行脚本**: 执行数据同步脚本
5. **验证效果**: 在网站中查看Logo显示效果
