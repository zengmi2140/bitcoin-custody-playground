import React from 'react';
import { UserPreference, ComponentState, CustodyData } from '../types';
import ComponentColumn from './ComponentColumn';

interface MainLayoutProps {
  userPreference: UserPreference | null;
  selectedSigners: string[];
  selectedWallet: string | null;
  selectedNode: string | null;
  getComponentState: (componentId: string, type: 'signer' | 'wallet' | 'node') => ComponentState;
  onComponentClick: (componentId: string, type: 'signer' | 'wallet' | 'node') => void;
  custodyData: CustodyData;
}

const MainLayout: React.FC<MainLayoutProps> = ({
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

  return (
    <main className="main-layout">
      <div className="layout-container three-column">
        
        {/* 硬件签名器列 - 始终显示 */}
        <ComponentColumn
          title="硬件签名器"
          components={custodyData.hardwareSigners}
          selectedComponents={selectedSigners}
          getComponentState={(id: string) => getComponentState(id, 'signer')}
          onComponentClick={(id: string) => onComponentClick(id, 'signer')}
          type="signer"
        />
        
        <div className="data-flow">
          <div className="flow-arrow">
            <span className="arrow">→</span>
            <span className="flow-text">签名和公钥</span>
          </div>
          
          {/* 传输方式标签区域 - 独立分隔两个箭头 */}
          {/* 传输方式标签区域 - 始终显示，避免布局跳动 */}
          <div className="transfer-methods">
            {transferMethods.map((method, index) => (
              <span key={index} className={`transfer-tag ${getTransferMethodClass(method)}`}>
                {method}
              </span>
            ))}
          </div>          
          <div className="flow-arrow left-arrow">
            <span className="arrow">←</span>
            <span className="flow-text">待签名的交易</span>
          </div>
        </div>
        
        {/* 软件钱包列 */}
        <ComponentColumn
          title="软件钱包"
          components={custodyData.softwareWallets}
          selectedComponents={selectedWallet ? [selectedWallet] : []}
          getComponentState={(id: string) => getComponentState(id, 'wallet')}
          onComponentClick={(id: string) => onComponentClick(id, 'wallet')}
          type="wallet"
        />
        
        <div 
          className="data-flow" 
          style={{
            height: '300px',
            minHeight: '300px',
            maxHeight: '300px'
          }}
        >
          <div className="flow-arrow">
            <span className="arrow">→</span>
            <span className="flow-text">地址；已签名交易</span>
          </div>
          
          {/* 占位符区域 - 与左侧传输标签区域保持一致的视觉效果 */}
          <div className="transfer-methods placeholder">
            <div className="placeholder-content">占位区域</div>
          </div>
          
          <div className="flow-arrow left-arrow">
            <span className="arrow">←</span>
            <span className="flow-text">余额信息</span>
          </div>
        </div>
        
        {/* 区块链节点列 */}
        <ComponentColumn
          title="区块链节点"
          components={custodyData.nodes}
          selectedComponents={selectedNode ? [selectedNode] : []}
          getComponentState={(id: string) => getComponentState(id, 'node')}
          onComponentClick={(id: string) => onComponentClick(id, 'node')}
          type="node"
        />
      </div>
    </main>
  );
};

export default MainLayout;