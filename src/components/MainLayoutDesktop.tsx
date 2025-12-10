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

  const signerFlowDisabledClass = isNoSignerSelected() ? 'disabled' : '';

  const signerTitleRef = useRef<HTMLHeadingElement>(null);
  const walletTitleRef = useRef<HTMLHeadingElement>(null);
  const nodeTitleRef = useRef<HTMLHeadingElement>(null);
  const signerGridRef = useRef<HTMLDivElement>(null);
  const walletGridRef = useRef<HTMLDivElement>(null);
  const nodeGridRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);

  const [centers, setCenters] = useState<{ signer?: number; wallet?: number; node?: number }>({});
  const [columnWidths, setColumnWidths] = useState<{ signer?: number; wallet?: number; node?: number }>({});
  const [lanePositions, setLanePositions] = useState<{
    lane1?: { left: number; width: number };
    lane2?: { left: number; width: number };
  }>({});
  const [layoutLeft, setLayoutLeft] = useState<number>(0);

  const measure = () => {
    const layoutRect = layoutRef.current?.getBoundingClientRect();
    const getGridMetrics = (gridEl?: HTMLElement | null): { center?: number; width?: number; left?: number } => {
      if (!gridEl || !layoutRect) return {};
      const rect = gridEl.getBoundingClientRect();
      return {
        center: Math.round(rect.left - layoutRect.left + rect.width / 2),
        width: Math.round(rect.width),
        left: rect.left - layoutRect.left
      };
    };

    const signerMetrics = getGridMetrics(signerGridRef.current);
    const walletMetrics = getGridMetrics(walletGridRef.current);
    const nodeMetrics = getGridMetrics(nodeGridRef.current);

    setLayoutLeft(layoutRect?.left ?? 0);

    setCenters({
      signer: signerMetrics.center,
      wallet: walletMetrics.center,
      node: nodeMetrics.center
    });

    setColumnWidths({
      signer: signerMetrics.width,
      wallet: walletMetrics.width,
      node: nodeMetrics.width
    });

    // 计算箭头可用区：列边缘之间的间隙，预留安全距离
    const safe = 24;
    const lane1Left = signerMetrics.left !== undefined && signerMetrics.width !== undefined
      ? signerMetrics.left + signerMetrics.width + safe
      : undefined;
    const lane1Right = walletMetrics.left !== undefined
      ? walletMetrics.left - safe
      : undefined;
    const lane2Left = walletMetrics.left !== undefined && walletMetrics.width !== undefined
      ? walletMetrics.left + walletMetrics.width + safe
      : undefined;
    const lane2Right = nodeMetrics.left !== undefined
      ? nodeMetrics.left - safe
      : undefined;

    setLanePositions({
      lane1: lane1Left !== undefined && lane1Right !== undefined
        ? { left: lane1Left, width: Math.max(40, lane1Right - lane1Left) }
        : undefined,
      lane2: lane2Left !== undefined && lane2Right !== undefined
        ? { left: lane2Left, width: Math.max(40, lane2Right - lane2Left) }
        : undefined
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
    [signerGridRef.current, walletGridRef.current, nodeGridRef.current, layoutRef.current].forEach(gridEl => {
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
      <div className="layout-container three-column" ref={layoutRef}>
        {/* 硬件签名器列 */}
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

        {/* 软件钱包列 */}
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

        {/* 区块链节点列 */}
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

        {/* 箭头与传输方式的覆盖层，不再占用网格列 */}
        <div
          className="flow-overlay"
          style={{
            '--lane1-left': lanePositions.lane1 ? `${lanePositions.lane1.left}px` : undefined,
            '--lane1-width': lanePositions.lane1 ? `${lanePositions.lane1.width}px` : undefined,
            '--lane2-left': lanePositions.lane2 ? `${lanePositions.lane2.left}px` : undefined,
            '--lane2-width': lanePositions.lane2 ? `${lanePositions.lane2.width}px` : undefined,
            '--lane-forward-top': '36%',
            '--lane-reverse-top': '56%',
            '--lane-transfer-top': '46%'
          } as React.CSSProperties}
        >
          {/* 方向：左 -> 右（硬件签名器 -> 软件钱包） */}
          <span className={`flow-track lane-forward gap-1 ${signerFlowDisabledClass}`} aria-hidden="true" />
          <div className={`flow-label-center lane-forward gap-1 ${signerFlowDisabledClass}`}>签名和公钥</div>
          {transferMethods.length > 0 && (
            <div className={`flow-transfer lane-forward gap-1 ${signerFlowDisabledClass}`}>
              {transferMethods.map((method, index) => (
                <span key={index} className={`transfer-tag ${getTransferMethodClass(method)}`}>
                  {method}
                </span>
              ))}
            </div>
          )}

          {/* 方向：右 -> 左（软件钱包 -> 硬件签名器） */}
          <span className={`flow-track lane-reverse gap-1 ${signerFlowDisabledClass}`} aria-hidden="true" />
          <div className={`flow-label-center lane-reverse gap-1 ${signerFlowDisabledClass}`}>待签名的交易</div>

          {/* 方向：左 -> 右（软件钱包 -> 区块链节点） */}
          <span className="flow-track lane-forward gap-2" aria-hidden="true" />
          <div className="flow-label-center lane-forward gap-2">地址；已签名交易</div>

          {/* 方向：右 -> 左（区块链节点 -> 软件钱包） */}
          <span className="flow-track lane-reverse gap-2" aria-hidden="true" />
          <div className="flow-label-center lane-reverse gap-2">余额信息</div>
        </div>
      </div>
      <BottomFeatureDock
        centers={centers}
        columnWidths={columnWidths}
        layoutLeft={layoutLeft}
        selectedSigners={selectedSigners}
        selectedWallet={selectedWallet}
        selectedNode={selectedNode}
        custodyData={custodyData}
      />
    </main>
  );
};

export default MainLayout;