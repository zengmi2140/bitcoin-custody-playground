// 特性类型
export interface Feature {
  type: 'positive' | 'negative' | 'warning';
  text: string;
}

// 硬件签名器类型
export interface HardwareSigner {
  id: string;
  name: string;
  logo: string;
  features: Feature[];
  compatibleWallets: string[];
}

// 软件钱包类型
export interface SoftwareWallet {
  id: string;
  name: string;
  logo: string;
  features: Feature[];
  compatibleSigners: string[];
  compatibleNodes: string[];
  supportedPlatforms: string[];
}

// 区块链节点类型
export interface BlockchainNode {
  id: string;
  name: string;
  logo: string;
  features: Feature[];
  compatibleWallets: string[];
}

// 连接关系类型
export interface Connection {
  from: string;
  to: string;
  method: string;
  direction: 'bidirectional' | 'to-wallet' | 'from-wallet';
  description: string;
}

// 组件状态类型
export type ComponentState = 'inactive' | 'breathing' | 'active';

// 用户偏好类型
export interface UserPreference {
  deviceType: 'mobile' | 'desktop';
  signerWillingness: 'no-signer' | 'with-signer';
}

// 数据存储类型
export interface CustodyData {
  hardwareSigners: HardwareSigner[];
  softwareWallets: SoftwareWallet[];
  nodes: BlockchainNode[];
  connections: Connection[];
  transferMethods: Record<string, Record<string, string[]>>;
}