import React from 'react';
import { createPortal } from 'react-dom';
import { CustodyData, Feature } from '../types';

interface BottomFeatureDockProps {
  centers: { signer?: number; wallet?: number; node?: number };
  columnWidths: { signer?: number; wallet?: number; node?: number };
  layoutLeft: number;
  selectedSigners: string[];
  selectedWallet: string | null;
  selectedNode: string | null;
  custodyData: CustodyData;
  offsetX?: number;
}

const renderFeatureItems = (features: Feature[]) => {
  return features.map((feature, index) => (
    <div key={index} className={`feature-item ${feature.type}`}>
      <span className="feature-icon">{feature.type === 'positive' ? '✅' : feature.type === 'negative' ? '❌' : '⚠️'}</span>
      <span className="feature-text">{feature.text}</span>
    </div>
  ));
};

const BottomFeatureDock: React.FC<BottomFeatureDockProps> = ({
  centers,
  columnWidths,
  layoutLeft,
  selectedSigners,
  selectedWallet,
  selectedNode,
  custodyData,
  offsetX = 0
}) => {
  const dockCommonStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 20,
    zIndex: 20,
    transform: 'translateX(-50%)'
  };

  const content = (
    <>
      {selectedSigners.length > 0 && centers.signer !== undefined && (
        <div
          className="feature-box signer"
          style={{ 
            ...dockCommonStyle, 
            left: layoutLeft + centers.signer + offsetX,
            width: columnWidths.signer ? `${columnWidths.signer}px` : 'auto'
          }}
        >
          <h4 className="feature-title">硬件签名器特性</h4>
          <div className="feature-list">
            {selectedSigners.flatMap(signerId => {
              const signer = custodyData.hardwareSigners.find(s => s.id === signerId);
              return signer ? renderFeatureItems(signer.features) : [];
            })}
          </div>
        </div>
      )}

      {selectedWallet && centers.wallet !== undefined && (
        <div
          className="feature-box wallet"
          style={{ 
            ...dockCommonStyle, 
            left: layoutLeft + centers.wallet + offsetX,
            width: columnWidths.wallet ? `${columnWidths.wallet}px` : 'auto'
          }}
        >
          <h4 className="feature-title">软件钱包特性</h4>
          <div className="feature-list">
            {(() => {
              const wallet = custodyData.softwareWallets.find(w => w.id === selectedWallet);
              return wallet ? renderFeatureItems(wallet.features) : null;
            })()}
          </div>
        </div>
      )}

      {selectedNode && centers.node !== undefined && (
        <div
          className="feature-box node"
          style={{ 
            ...dockCommonStyle, 
            left: layoutLeft + centers.node + offsetX,
            width: columnWidths.node ? `${columnWidths.node}px` : 'auto'
          }}
        >
          <h4 className="feature-title">区块链节点特性</h4>
          <div className="feature-list">
            {(() => {
              const node = custodyData.nodes.find(n => n.id === selectedNode);
              return node ? renderFeatureItems(node.features) : null;
            })()}
          </div>
        </div>
      )}
    </>
  );

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(content, document.body);
};

export default BottomFeatureDock;
