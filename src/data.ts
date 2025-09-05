import { CustodyData } from './types';

export const custodyData: CustodyData = {
  hardwareSigners: [
    {
      id: 'trezor',
      name: 'Trezor',
      logo: '🔒',
      features: [
        { type: 'positive', text: '支持多种币种' },
        { type: 'positive', text: '开源固件' },
        { type: 'negative', text: '不防拆' },
        { type: 'warning', text: '需要通过Trezor Suite连接' }
      ],
      compatibleWallets: ['sparrow', 'electrum', 'bluewallet']
    },
    {
      id: 'coldcard',
      name: 'ColdCard',
      logo: '❄️',
      features: [
        { type: 'positive', text: '仅支持比特币' },
        { type: 'positive', text: '防拆设计' },
        { type: 'positive', text: '支持气隙传输' },
        { type: 'warning', text: '需要学习曲线' }
      ],
      compatibleWallets: ['sparrow', 'electrum', 'specter']
    },
    {
      id: 'keystone',
      name: 'Keystone',
      logo: '📱',
      features: [
        { type: 'positive', text: '大屏幕显示' },
        { type: 'positive', text: '二维码传输' },
        { type: 'positive', text: '开源硬件' },
        { type: 'negative', text: '体积较大' }
      ],
      compatibleWallets: ['sparrow', 'bluewallet', 'metamask']
    },
    {
      id: 'ledger',
      name: 'Ledger',
      logo: '💳',
      features: [
        { type: 'positive', text: '安全芯片' },
        { type: 'positive', text: '便携设计' },
        { type: 'negative', text: '闭源固件' },
        { type: 'warning', text: '历史上有数据泄露' }
      ],
      compatibleWallets: ['sparrow', 'electrum', 'ledger-live']
    },
    {
      id: 'bitbox',
      name: 'BitBox02',
      logo: '📦',
      features: [
        { type: 'positive', text: '瑞士制造' },
        { type: 'positive', text: '开源' },
        { type: 'positive', text: '触摸按钮' },
        { type: 'negative', text: '市场占有率较小' }
      ],
      compatibleWallets: ['sparrow', 'electrum', 'bitbox-app']
    },
    {
      id: 'none',
      name: '不使用签名器',
      logo: '🚫',
      features: [
        { type: 'warning', text: '私钥存储在软件钱包中' },
        { type: 'negative', text: '安全性相对较低' },
        { type: 'positive', text: '使用简便' },
        { type: 'positive', text: '无需额外硬件' }
      ],
      compatibleWallets: ['sparrow', 'electrum', 'bluewallet', 'specter', 'bitcoin-core-wallet']
    }
  ],
  softwareWallets: [
    {
      id: 'sparrow',
      name: 'Sparrow Wallet',
      logo: '🐦',
      features: [
        { type: 'positive', text: 'UTXO选择' },
        { type: 'positive', text: '支持Taproot' },
        { type: 'positive', text: '隐私友好' },
        { type: 'warning', text: '仅支持桌面平台' }
      ],
      compatibleSigners: ['trezor', 'coldcard', 'keystone', 'ledger', 'bitbox'],
      compatibleNodes: ['bitcoin-core', 'electrum-server'],
      supportedPlatforms: ['desktop']
    },
    {
      id: 'electrum',
      name: 'Electrum',
      logo: '⚡',
      features: [
        { type: 'positive', text: 'UTXO选择' },
        { type: 'positive', text: '发送到多个地址' },
        { type: 'positive', text: 'P2WPKH地址格式' },
        { type: 'negative', text: '不支持Taproot地址' },
        { type: 'warning', text: '使用Electrum助记词标准（而非BIP39）' }
      ],
      compatibleSigners: ['trezor', 'coldcard', 'ledger', 'bitbox'],
      compatibleNodes: ['electrum-server', 'bitcoin-core'],
      supportedPlatforms: ['desktop', 'mobile']
    },
    {
      id: 'bluewallet',
      name: 'BlueWallet',
      logo: '💙',
      features: [
        { type: 'positive', text: '移动端友好' },
        { type: 'positive', text: '支持闪电网络' },
        { type: 'positive', text: '界面美观' },
        { type: 'negative', text: '桌面版功能有限' }
      ],
      compatibleSigners: ['trezor', 'keystone'],
      compatibleNodes: ['electrum-server', 'lnd'],
      supportedPlatforms: ['mobile', 'desktop']
    },
    {
      id: 'specter',
      name: 'Specter Desktop',
      logo: '👻',
      features: [
        { type: 'positive', text: '专注硬件钱包' },
        { type: 'positive', text: '支持多签' },
        { type: 'positive', text: '隐私保护' },
        { type: 'warning', text: '需要运行自己的节点' }
      ],
      compatibleSigners: ['coldcard', 'trezor', 'ledger'],
      compatibleNodes: ['bitcoin-core'],
      supportedPlatforms: ['desktop']
    },
    {
      id: 'bitcoin-core-wallet',
      name: 'Bitcoin Core Wallet',
      logo: '₿',
      features: [
        { type: 'positive', text: '官方实现' },
        { type: 'positive', text: '完全验证' },
        { type: 'negative', text: '界面简陋' },
        { type: 'negative', text: '不支持硬件签名器' }
      ],
      compatibleSigners: [],
      compatibleNodes: ['bitcoin-core'],
      supportedPlatforms: ['desktop']
    }
  ],
  nodes: [
    {
      id: 'bitcoin-core',
      name: 'Bitcoin Core',
      logo: '🟠',
      features: [
        { type: 'positive', text: '完整验证所有交易' },
        { type: 'positive', text: '最高安全性' },
        { type: 'negative', text: '需要大量存储空间（500GB+）' },
        { type: 'warning', text: '初始同步时间长（数天）' }
      ],
      compatibleWallets: ['sparrow', 'electrum', 'specter', 'bitcoin-core-wallet']
    },
    {
      id: 'electrum-server',
      name: 'Electrum Server',
      logo: '🔌',
      features: [
        { type: 'positive', text: '快速同步' },
        { type: 'positive', text: '隐私友好' },
        { type: 'negative', text: '依赖Bitcoin Core' },
        { type: 'warning', text: '需要额外设置' }
      ],
      compatibleWallets: ['sparrow', 'electrum', 'bluewallet']
    },

  ],
  connections: [
    {
      from: 'trezor',
      to: 'sparrow',
      method: 'usb',
      direction: 'bidirectional',
      description: '通过USB连接传输签名和公钥'
    },
    {
      from: 'coldcard',
      to: 'sparrow',
      method: 'sdcard',
      direction: 'bidirectional',
      description: '通过SD卡气隙传输PSBT文件'
    },
    {
      from: 'bitcoin-core',
      to: 'sparrow',
      method: 'rpc',
      direction: 'to-wallet',
      description: '提供区块链数据和交易广播'
    },
    {
      from: 'electrum-server',
      to: 'electrum',
      method: 'tcp',
      direction: 'to-wallet',
      description: '提供简化的区块链数据'
    }
  ],
  transferMethods: {
    'trezor': {
      'sparrow': ['USB'],
      'electrum': ['USB'],
      'bluewallet': ['USB']
    },
    'coldcard': {
      'sparrow': ['SD卡', 'PSBT'],
      'electrum': ['SD卡', 'PSBT'],
      'specter': ['SD卡', 'PSBT']
    },
    'keystone': {
      'sparrow': ['二维码', 'USB'],
      'bluewallet': ['二维码']
    },
    'ledger': {
      'sparrow': ['USB'],
      'electrum': ['USB', '蓝牙']
    },
    'bitbox': {
      'sparrow': ['USB'],
      'electrum': ['USB']
    }
  }
};