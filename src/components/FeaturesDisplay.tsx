import React from 'react';
import { custodyData } from '../data';
import { Feature } from '../types';

interface FeaturesDisplayProps {
  selectedSigners: string[];
  selectedWallet: string | null;
  selectedNode: string | null;
}

const FeaturesDisplay: React.FC<FeaturesDisplayProps> = ({
  selectedSigners,
  selectedWallet,
  selectedNode
}) => {
  const getFeatureIcon = (type: Feature['type']): string => {
    switch (type) {
      case 'positive': return '✅';
      case 'negative': return '❌';
      case 'warning': return '⚠️';
      default: return '';
    }
  };

  const renderFeatureList = (features: Feature[], title: string) => {
    if (features.length === 0) return null;
    
    return (
      <div className="feature-category">
        <h4>{title}</h4>
        <ul>
          {features.map((feature, index) => (
            <li key={index} className={`feature-item ${feature.type}`}>
              <span className="feature-icon">{getFeatureIcon(feature.type)}</span>
              <span className="feature-text">{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // 获取选中组件的特性
  const getSelectedFeatures = () => {
    const signerFeatures: Feature[] = [];
    const walletFeatures: Feature[] = [];
    const nodeFeatures: Feature[] = [];

    // 收集签名器特性
    selectedSigners.forEach(signerId => {
      const signer = custodyData.hardwareSigners.find(s => s.id === signerId);
      if (signer) {
        signerFeatures.push(...signer.features);
      }
    });

    // 收集钱包特性
    if (selectedWallet) {
      const wallet = custodyData.softwareWallets.find(w => w.id === selectedWallet);
      if (wallet) {
        walletFeatures.push(...wallet.features);
      }
    }

    // 收集节点特性
    if (selectedNode) {
      const node = custodyData.nodes.find(n => n.id === selectedNode);
      if (node) {
        nodeFeatures.push(...node.features);
      }
    }

    return { signerFeatures, walletFeatures, nodeFeatures };
  };

  const { signerFeatures, walletFeatures, nodeFeatures } = getSelectedFeatures();
  
  // 如果没有选择任何组件，显示提示信息
  if (selectedSigners.length === 0 && !selectedWallet && !selectedNode) {
    return (
      <div className="features-display">
        <div className="features-container">
          <div className="no-selection">
            <h3>请选择组件来查看特性</h3>
            <p>点击上方的组件图标来了解不同比特币自主托管方案的特性、优缺点和注意事项。</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="features-display">
      <div className="features-container">
        <h3>当前选择的特性</h3>
        
        <div className="features-grid">
          {selectedSigners.length > 0 && (
            <div className="features-column">
              {renderFeatureList(signerFeatures, '硬件签名器特性')}
            </div>
          )}
          
          {selectedWallet && (
            <div className="features-column">
              {renderFeatureList(walletFeatures, '软件钱包特性')}
            </div>
          )}
          
          {selectedNode && (
            <div className="features-column">
              {renderFeatureList(nodeFeatures, '区块链节点特性')}
            </div>
          )}
        </div>

        {/* 组合建议 */}
        {selectedSigners.length > 0 && selectedWallet && (
          <div className="combination-advice">
            <h4>💡 组合建议</h4>
            <div className="advice-content">
              {selectedNode ? (
                <p>
                  <strong>完整配置：</strong>您已选择了一个完整的自主托管方案。
                  这种配置提供了良好的安全性和隐私保护。建议定期备份种子词并妥善保管硬件设备。
                </p>
              ) : (
                <p>
                  <strong>基础配置：</strong>您的当前配置已经具备基本的安全性。
                  考虑添加自己的节点以获得更好的隐私保护和完全验证。
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturesDisplay;