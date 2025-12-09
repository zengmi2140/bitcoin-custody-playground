import React, { useState } from 'react';
import { UserPreference, ComponentState, CustodyData, Feature } from '../types';
import ComponentColumn from './ComponentColumn';
import ColumnTitle from './ColumnTitle';
import MobileFeatureDrawer from './MobileFeatureDrawer';

// 列标题常量（写死文案）
const COLUMN_TITLES = {
  signer: '硬件签名器',
  wallet: '软件钱包',
  node: '区块链节点',
} as const;

interface MainLayoutMobileProps {
  userPreference: UserPreference | null;
  selectedSigners: string[];
  selectedWallet: string | null;
  selectedNode: string | null;
  getComponentState: (componentId: string, type: 'signer' | 'wallet' | 'node') => ComponentState;
  onComponentClick: (componentId: string, type: 'signer' | 'wallet' | 'node') => void;
  custodyData: CustodyData;
}

const MainLayoutMobile: React.FC<MainLayoutMobileProps> = ({
  userPreference,
  selectedSigners,
  selectedWallet,
  selectedNode,
  getComponentState,
  onComponentClick,
  custodyData
}) => {
  // 移动端 Drawer 状态
  const [drawerState, setDrawerState] = useState<{
    isOpen: boolean;
    title: string;
    features: Feature[];
  }>({
    isOpen: false,
    title: '',
    features: []
  });

  if (!userPreference) {
    return (
      <main className="main-layout loading">
        <div className="loading-message">
          正在加载...
        </div>
      </main>
    );
  }

  // 包装点击事件，处理移动端 Drawer 逻辑
  const handleComponentClick = (id: string, type: 'signer' | 'wallet' | 'node') => {
    // 1. 执行原有的选择逻辑
    onComponentClick(id, type);

    let componentName = '';
    let componentFeatures: Feature[] = [];

    // 查找组件数据
    if (type === 'signer') {
      const signer = custodyData.hardwareSigners.find(s => s.id === id);
      if (signer) {
        componentName = signer.name;
        componentFeatures = signer.features || [];
      }
    } else if (type === 'wallet') {
      const wallet = custodyData.softwareWallets.find(w => w.id === id);
      if (wallet) {
        componentName = wallet.name;
        componentFeatures = wallet.features || [];
      }
    } else if (type === 'node') {
      const node = custodyData.nodes.find(n => n.id === id);
      if (node) {
        componentName = node.name;
        componentFeatures = node.features || [];
      }
    }

    // 如果找到了组件数据，打开 Drawer
    if (componentName) {
      setDrawerState({
        isOpen: true,
        title: componentName,
        features: componentFeatures
      });
    }
  };

  // 获取传输方式对应的CSS类名
  const getTransferMethodClass = (method: string): string => {
    const methodClassMap: { [key: string]: string } = {
      'SD卡': 'sd-card',
      'microSD 卡': 'sd-card', // 添加对 microSD 卡的支持
      '二维码': 'qr-code', 
      'USB': 'usb',
      '蓝牙': 'bluetooth',
      'NFC': 'nfc'
    };
    return methodClassMap[method] || 'usb'; // 默认使用USB样式
  };

  // 获取当前选中的传输方式
  const getTransferMethods = (): string[] => {
    if (!selectedSigners.length || !selectedWallet || selectedSigners.includes('none')) {
      return [];
    }
    
    const transferMethods: string[] = [];
    selectedSigners.forEach(signerId => {
      const methods = custodyData.transferMethods?.[signerId]?.[selectedWallet] || [];
      methods.forEach(method => {
        if (!transferMethods.includes(method)) {
          transferMethods.push(method);
        }
      });
    });
    
    return transferMethods;
  };

  const transferMethods = getTransferMethods();

  // 对硬件签名器列表进行排序，确保"不使用签名器"始终在最后
  const sortedHardwareSigners = [...custodyData.hardwareSigners].sort((a, b) => {
    if (a.id === 'none' && b.id !== 'none') return 1;
    if (b.id === 'none' && a.id !== 'none') return -1;
    return 0;
  });

  return (
    <main className="main-layout">
      <div className="layout-container three-column">
        {/* 硬件签名器列 */}
        <div className="component-column">
          <ColumnTitle title={COLUMN_TITLES.signer} />
          <ComponentColumn
            components={sortedHardwareSigners}
            selectedComponents={selectedSigners}
            getComponentState={(id: string) => getComponentState(id, 'signer')}
            onComponentClick={(id: string) => handleComponentClick(id, 'signer')}
            type="signer"
          />
        </div>

        {/* 移动端数据流指示器 (Signer -> Wallet) */}
        <div className="mobile-flow-indicator">
          <div className="flow-arrow-down">↓</div>
          <div className="flow-content">
            <span className="flow-label">签名和公钥</span>
            {transferMethods.length > 0 && (
              <div className="flow-transfer-methods">
                {transferMethods.map((method, index) => (
                  <span key={index} className={`transfer-tag ${getTransferMethodClass(method)}`}>
                    {method}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 软件钱包列 */}
        <div className="component-column">
          <ColumnTitle title={COLUMN_TITLES.wallet} />
          <ComponentColumn
            components={custodyData.softwareWallets}
            selectedComponents={selectedWallet ? [selectedWallet] : []}
            getComponentState={(id: string) => getComponentState(id, 'wallet')}
            onComponentClick={(id: string) => handleComponentClick(id, 'wallet')}
            type="wallet"
          />
        </div>

        {/* 移动端数据流指示器 (Wallet -> Node) */}
        <div className="mobile-flow-indicator">
          <div className="flow-arrow-down">↓</div>
          <div className="flow-content">
            <span className="flow-label">地址；已签名交易</span>
          </div>
        </div>

        {/* 区块链节点列 */}
        <div className="component-column">
          <ColumnTitle title={COLUMN_TITLES.node} />
          <ComponentColumn
            components={custodyData.nodes}
            selectedComponents={selectedNode ? [selectedNode] : []}
            getComponentState={(id: string) => getComponentState(id, 'node')}
            onComponentClick={(id: string) => handleComponentClick(id, 'node')}
            type="node"
          />
        </div>
      </div>

      {/* 移动端特性 Drawer */}
      <MobileFeatureDrawer
        isOpen={drawerState.isOpen}
        onClose={() => setDrawerState(prev => ({ ...prev, isOpen: false }))}
        title={drawerState.title}
        features={drawerState.features}
      />
    </main>
  );
};

export default MainLayoutMobile;
