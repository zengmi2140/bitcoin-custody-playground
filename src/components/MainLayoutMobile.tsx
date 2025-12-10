import React, { useRef } from 'react';
import { UserPreference, ComponentState, CustodyData } from '../types';
import ComponentColumn from './ComponentColumn';

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
  if (!userPreference) {
    return (
      <main className="main-layout loading">
        <div className="loading-message">
          正在加载...
        </div>
      </main>
    );
  }

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

  const mobileTitleStyle: React.CSSProperties = {
    position: 'static',
    top: 'auto',
    zIndex: 'auto',
    background: 'transparent',
    fontSize: '1.4rem',
    fontWeight: 600,
    color: '#2d3748',
    textAlign: 'center',
    margin: '0 0 10px 0',
    padding: 0,
    width: '100%',
    display: 'grid',
    placeItems: 'center',
    gridTemplateColumns: '1fr',
    boxSizing: 'border-box'
  };

  // 对硬件签名器列表进行排序，确保"不使用签名器"始终在最后
  const sortedHardwareSigners = [...custodyData.hardwareSigners].sort((a, b) => {
    if (a.id === 'none' && b.id !== 'none') return 1;
    if (b.id === 'none' && a.id !== 'none') return -1;
    return 0;
  });

  const signerFeatures = selectedSigners.flatMap(id => {
    const signer = custodyData.hardwareSigners.find(s => s.id === id);
    return signer ? signer.features : [];
  });

  const walletFeatures = selectedWallet
    ? (custodyData.softwareWallets.find(w => w.id === selectedWallet)?.features || [])
    : [];

  const nodeFeatures = selectedNode
    ? (custodyData.nodes.find(n => n.id === selectedNode)?.features || [])
    : [];

  const renderFeatureBox = (title: string, features: { type: 'positive' | 'negative' | 'warning'; text: string }[]) => {
    if (!features.length) return null;
    return (
      <div className="feature-box">
        <h4 className="feature-title">{title}</h4>
        <div className="feature-list">
          {features.map((feature, index) => (
            <div key={index} className={`feature-item ${feature.type}`}>
              <span className="feature-icon">
                {feature.type === 'positive' ? '✅' : feature.type === 'negative' ? '❌' : '⚠️'}
              </span>
              <span className="feature-text">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const flowSignerToWalletRef = useRef<HTMLDivElement | null>(null);
  const flowWalletToNodeRef = useRef<HTMLDivElement | null>(null);
  const featureSectionRef = useRef<HTMLDivElement | null>(null);
  const SCROLL_OFFSET = 100;

  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const targetTop = window.scrollY + rect.top - SCROLL_OFFSET;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  };

  const handleSignerSelect = (id: string) => {
    onComponentClick(id, 'signer');
    scrollToSection(flowSignerToWalletRef);
  };

  const handleWalletSelect = (id: string) => {
    onComponentClick(id, 'wallet');
    scrollToSection(flowWalletToNodeRef);
  };

  const handleNodeSelect = (id: string) => {
    onComponentClick(id, 'node');
    scrollToSection(featureSectionRef);
  };

  return (
    <main className="main-layout">
      <div className="layout-container three-column">
        {/* 硬件签名器列 */}
        <div className="component-column">
          <h2 className="column-title" style={mobileTitleStyle}>
            {COLUMN_TITLES.signer}
          </h2>
          <ComponentColumn
            components={sortedHardwareSigners}
            selectedComponents={selectedSigners}
            getComponentState={(id: string) => getComponentState(id, 'signer')}
            onComponentClick={handleSignerSelect}
            type="signer"
          />
        </div>

        {/* 移动端数据流指示器 (Signer ↔ Wallet) */}
        <div className="mobile-flow-indicator" ref={flowSignerToWalletRef}>
          <span className="flow-sub-label top" aria-label="软件钱包向签名器传递待签名交易">待签名交易</span>
          <div className="mobile-flow-arrows" aria-label="硬件签名器与软件钱包双向数据流">
            <span className="flow-arrow up">↑</span>
            <span className="flow-arrow down">↓</span>
          </div>
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
          <h2 className="column-title" style={mobileTitleStyle}>
            {COLUMN_TITLES.wallet}
          </h2>
          <ComponentColumn
            components={custodyData.softwareWallets}
            selectedComponents={selectedWallet ? [selectedWallet] : []}
            getComponentState={(id: string) => getComponentState(id, 'wallet')}
            onComponentClick={handleWalletSelect}
            type="wallet"
          />
        </div>

        {/* 移动端数据流指示器 (Wallet ↔ Node) */}
        <div className="mobile-flow-indicator" ref={flowWalletToNodeRef}>
          <span className="flow-sub-label top" aria-label="节点返回余额信息">余额信息</span>
          <div className="mobile-flow-arrows" aria-label="软件钱包与区块链节点双向数据流">
            <span className="flow-arrow up">↑</span>
            <span className="flow-arrow down">↓</span>
          </div>
          <div className="flow-content">
            <span className="flow-label">地址；已签名交易</span>
          </div>
        </div>

        {/* 区块链节点列 */}
        <div className="component-column">
          <h2 className="column-title" style={mobileTitleStyle}>
            {COLUMN_TITLES.node}
          </h2>
          <ComponentColumn
            components={custodyData.nodes}
            selectedComponents={selectedNode ? [selectedNode] : []}
            getComponentState={(id: string) => getComponentState(id, 'node')}
            onComponentClick={handleNodeSelect}
            type="node"
          />
        </div>
      </div>

      <div className="mobile-feature-section" ref={featureSectionRef}>
        {renderFeatureBox('硬件签名器特性', signerFeatures)}
        {renderFeatureBox('软件钱包特性', walletFeatures)}
        {renderFeatureBox('区块链节点特性', nodeFeatures)}
      </div>
    </main>
  );
};

export default MainLayoutMobile;
