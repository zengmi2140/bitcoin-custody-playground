import React, { useLayoutEffect, useRef, useState } from 'react';
import { UserPreference, ComponentState, CustodyData } from '../types';
import ComponentColumn from './ComponentColumn';
import ColumnTitle from './ColumnTitle';

// 列标题常量（写死文案）
const COLUMN_TITLES = {
  signer: '硬件签名器',
  wallet: '软件钱包',
  node: '区块链节点',
} as const;
import BottomFeatureDock from './BottomFeatureDock';

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

  // 判断是否选择了"不使用签名器"
  const isNoSignerSelected = (): boolean => {
    return selectedSigners.includes('none');
  };

  const signerTitleRef = useRef<HTMLHeadingElement>(null);
  const walletTitleRef = useRef<HTMLHeadingElement>(null);
  const nodeTitleRef = useRef<HTMLHeadingElement>(null);
  const signerGridRef = useRef<HTMLDivElement>(null);
  const walletGridRef = useRef<HTMLDivElement>(null);
  const nodeGridRef = useRef<HTMLDivElement>(null);

  const [centers, setCenters] = useState<{ signer?: number; wallet?: number; node?: number }>({});

  const measure = () => {
    const getGridCenter = (gridEl?: HTMLElement | null): number | undefined => {
      if (!gridEl) return undefined;
      const rect = gridEl.getBoundingClientRect();
      return Math.round(rect.left + rect.width / 2);
    };

    setCenters({
      signer: getGridCenter(signerGridRef.current),
      wallet: getGridCenter(walletGridRef.current),
      node: getGridCenter(nodeGridRef.current)
    });
  };

  useLayoutEffect(() => {
    const observeTargets: (Element | null)[] = [];
    const ro = new ResizeObserver(() => measure());

    // 初次测量：等字体就绪后再次测量，避免字体替换引起的宽度变化
    measure();
    if ((document as any).fonts && (document as any).fonts.ready) {
      (document as any).fonts.ready.then(() => measure()).catch(() => {});
    }

    // 监听网格元素尺寸变化
    [signerGridRef.current, walletGridRef.current, nodeGridRef.current].forEach(gridEl => {
      if (gridEl) {
        ro.observe(gridEl);
        observeTargets.push(gridEl);
      }
    });

    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
      observeTargets.forEach(t => t && ro.unobserve(t));
      ro.disconnect();
    };
  }, []);

  // 对硬件签名器列表进行排序，确保"不使用签名器"始终在最后
  const sortedHardwareSigners = [...custodyData.hardwareSigners].sort((a, b) => {
    // 如果一个是"不使用签名器"，另一个不是，则"不使用签名器"排在后面
    if (a.id === 'none' && b.id !== 'none') return 1;
    if (b.id === 'none' && a.id !== 'none') return -1;
    // 其他情况保持原有顺序
    return 0;
  });

  return (
    <main className="main-layout">
      <div className="layout-container three-column">
        
        {/* 硬件签名器列 - 标题 + 网格（同一列容器内） */}
        <div className="component-column">
          <ColumnTitle title={COLUMN_TITLES.signer} ref={signerTitleRef} />
          <ComponentColumn
            components={sortedHardwareSigners}
            selectedComponents={selectedSigners}
            getComponentState={(id: string) => getComponentState(id, 'signer')}
            onComponentClick={(id: string) => onComponentClick(id, 'signer')}
            type="signer"
            ref={signerGridRef}
          />
        </div>
        
        <div className={`data-flow ${isNoSignerSelected() ? 'disabled' : ''}`}>
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
        
        {/* 软件钱包列 - 标题 + 网格（同一列容器内） */}
        <div className="component-column">
          <ColumnTitle title={COLUMN_TITLES.wallet} ref={walletTitleRef} />
          <ComponentColumn
            components={custodyData.softwareWallets}
            selectedComponents={selectedWallet ? [selectedWallet] : []}
            getComponentState={(id: string) => getComponentState(id, 'wallet')}
            onComponentClick={(id: string) => onComponentClick(id, 'wallet')}
            type="wallet"
            ref={walletGridRef}
          />
        </div>
        
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
            {/* 占位区域标签已隐藏，仅保留占位空间 */}
          </div>
          
          <div className="flow-arrow left-arrow">
            <span className="arrow">←</span>
            <span className="flow-text">余额信息</span>
          </div>
        </div>
        
        {/* 区块链节点列 - 标题 + 网格（同一列容器内） */}
        <div className="component-column">
          <ColumnTitle title={COLUMN_TITLES.node} ref={nodeTitleRef} />
          <ComponentColumn
            components={custodyData.nodes}
            selectedComponents={selectedNode ? [selectedNode] : []}
            getComponentState={(id: string) => getComponentState(id, 'node')}
            onComponentClick={(id: string) => onComponentClick(id, 'node')}
            type="node"
            ref={nodeGridRef}
          />
        </div>
      </div>
      <BottomFeatureDock
        centers={centers}
        selectedSigners={selectedSigners}
        selectedWallet={selectedWallet}
        selectedNode={selectedNode}
        custodyData={custodyData}
      />
    </main>
  );
};

export default MainLayout;