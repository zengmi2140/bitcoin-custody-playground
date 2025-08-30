import React, { useState, useEffect } from 'react';
import { UserPreference, ComponentState, CustodyData } from './types';
import Header from './components/Header';
import MainLayout from './components/MainLayout';
import InitialGuide from './components/InitialGuide';
import './index.css';

interface AppState {
  selectedSigners: string[];
  selectedWallet: string | null;
  selectedNode: string | null;
  userPreference: UserPreference | null;
  showGuide: boolean;
  custodyData: CustodyData | null;
  isLoading: boolean;
}

function App() {
  const [state, setState] = useState<AppState>({
    selectedSigners: [],
    selectedWallet: null,
    selectedNode: null,
    userPreference: null,
    showGuide: true,
    custodyData: null,
    isLoading: true
  });

  // 加载JSON数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/custody-data.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: CustodyData = await response.json();
        setState(prev => ({ ...prev, custodyData: data, isLoading: false }));
      } catch (error) {
        console.error('Failed to load custody data:', error);
        // 如果加载失败，使用备用数据
        const { getFallbackData } = await import('./dataLoader');
        const fallbackData = getFallbackData();
        setState(prev => ({ ...prev, custodyData: fallbackData, isLoading: false }));
      }
    };
    
    loadData();
  }, []);

  // 从本地存储加载用户偏好
  useEffect(() => {
    const savedPreference = localStorage.getItem('userPreference');
    if (savedPreference) {
      const preference = JSON.parse(savedPreference);
      setState(prev => ({
        ...prev,
        userPreference: preference,
        showGuide: false
      }));
    }
  }, []);

  // 计算组件状态
  const getComponentState = (componentId: string, type: 'signer' | 'wallet' | 'node'): ComponentState => {
    if (!state.custodyData || !state.userPreference) return 'inactive';
    
    // 使用用户偏好中存储的设备类型
    const userDeviceType = state.userPreference.deviceType;
    
    if (type === 'signer') {
      if (state.selectedSigners.includes(componentId)) return 'active';
      
      // 如果该列已有选中项，其他项不呼吸
      if (state.selectedSigners.length > 0) {
        return 'inactive';
      }
      
      // 检查与当前选择的钱包是否兼容
      if (state.selectedWallet) {
        const wallet = state.custodyData.softwareWallets.find(w => w.id === state.selectedWallet);
        if (wallet && wallet.compatibleSigners.includes(componentId)) {
          return 'breathing';
        }
      }
      
      // 初始状态：如果用户选择了“愿意尝试硬件签名器”，硬件签名器列呼吸
      if (state.userPreference.signerWillingness === 'with-signer' && state.selectedWallet === null) {
        return 'breathing';
      }
      
      return 'inactive';
    }
    
    if (type === 'wallet') {
      if (state.selectedWallet === componentId) return 'active';
      
      // 如果该列已有选中项，其他项不呼吸
      if (state.selectedWallet !== null) {
        return 'inactive';
      }
      
      const wallet = state.custodyData.softwareWallets.find(w => w.id === componentId);
      if (!wallet) return 'inactive';
      
      // 检查是否支持用户选择的设备类型
      if (!wallet.supportedPlatforms.includes(userDeviceType)) {
        return 'inactive';
      }
      
      // 检查与选择的签名器是否兼容
      if (state.selectedSigners.length > 0) {
        // 如果选中的是“不使用签名器”，支持当前设备的钱包就呼吸
        if (state.selectedSigners.includes('none')) {
          return 'breathing';
        }
        // 如果选中的是其他硬件签名器，检查兼容性
        if (state.selectedSigners.some(signer => signer !== 'none' && wallet.compatibleSigners.includes(signer))) {
          return 'breathing';
        }
      } else {
        // 初始状态：如果用户选择了“愿意尝试”但还没选签名器，不让钱包呼吸
        if (state.userPreference.signerWillingness === 'with-signer') {
          return 'inactive';
        }
      }
      
      return 'inactive';
    }
    
    if (type === 'node') {
      if (state.selectedNode === componentId) return 'active';
      
      // 如果该列已有选中项，其他项不呼吸
      if (state.selectedNode !== null) {
        return 'inactive';
      }
      
      // 检查与选择的钱包是否兼容
      if (state.selectedWallet) {
        const node = state.custodyData.nodes.find(n => n.id === componentId);
        if (node && node.compatibleWallets.includes(state.selectedWallet)) {
          return 'breathing';
        }
      }
      
      return 'inactive';
    }
    
    return 'inactive';
  };

  // 处理组件点击
  const handleComponentClick = (componentId: string, type: 'signer' | 'wallet' | 'node') => {
    if (type === 'signer') {
      setState(prev => {
        const isSelected = prev.selectedSigners.includes(componentId);
        const currentState = getComponentState(componentId, type);
        
        // 如果点击的是"不使用签名器"，更新用户意愿
        if (componentId === 'none') {
          const newPreference = {
            ...prev.userPreference!,
            signerWillingness: 'no-signer' as const
          };
          localStorage.setItem('userPreference', JSON.stringify(newPreference));
          
          return {
            ...prev,
            userPreference: newPreference,
            selectedSigners: [componentId],
            selectedWallet: null,
            selectedNode: null
          };
        }
        
        // 如果之前选择了"不使用签名器"，现在选择其他签名器，更新意愿
        if (prev.selectedSigners.includes('none') && componentId !== 'none') {
          const newPreference = {
            ...prev.userPreference!,
            signerWillingness: 'with-signer' as const
          };
          localStorage.setItem('userPreference', JSON.stringify(newPreference));
          
          return {
            ...prev,
            userPreference: newPreference,
            selectedSigners: [componentId],
            selectedWallet: null,
            selectedNode: null
          };
        }
        
        if (currentState === 'inactive') {
          // 重置其他选择并选择新的签名器
          return {
            ...prev,
            selectedSigners: [componentId],
            selectedWallet: null,
            selectedNode: null
          };
        } else if (isSelected) {
          // 取消选择
          return {
            ...prev,
            selectedSigners: prev.selectedSigners.filter(id => id !== componentId)
          };
        } else {
          // 添加到选择中（多签模式）
          return {
            ...prev,
            selectedSigners: [...prev.selectedSigners, componentId]
          };
        }
      });
    } else if (type === 'wallet') {
      setState(prev => {
        const currentState = getComponentState(componentId, type);
        
        if (currentState === 'inactive') {
          // 重置并选择新钱包
          return {
            ...prev,
            selectedWallet: componentId,
            selectedNode: null
          };
        } else if (prev.selectedWallet === componentId) {
          // 取消选择
          return {
            ...prev,
            selectedWallet: null
          };
        } else {
          // 选择新钱包
          return {
            ...prev,
            selectedWallet: componentId
          };
        }
      });
    } else if (type === 'node') {
      setState(prev => {
        const currentState = getComponentState(componentId, type);
        
        if (currentState !== 'inactive') {
          return {
            ...prev,
            selectedNode: prev.selectedNode === componentId ? null : componentId
          };
        }
        
        return prev;
      });
    }
  };

  // 计算完成度
  const getCompletionPercentage = (): number => {
    if (!state.userPreference) return 0;
    
    // 新的进度计算逻辑：根据用户在Markdown文档中定义的规则
    const hasWallet = state.selectedWallet !== null;
    const hasSigner = state.selectedSigners.length > 0;
    const hasNode = state.selectedNode !== null;
    const hasNoneSigner = state.selectedSigners.includes('none');
    const hasHardwareSigner = state.selectedSigners.some(id => id !== 'none');
    
    // 情况7: 硬件签名器 + 软件钱包 + 区块链节点 → 120%
    if (hasHardwareSigner && hasWallet && hasNode) {
      return 120;
    }
    
    // 情况6: 硬件签名器 + 软件钱包 → 100%
    if (hasHardwareSigner && hasWallet) {
      return 100;
    }
    
    // 情况3: "不使用签名器" + 软件钱包 + 区块链节点 → 80%
    if (hasNoneSigner && hasWallet && hasNode) {
      return 80;
    }
    
    // 情况2: "不使用签名器" + 软件钱包 → 60%
    if (hasNoneSigner && hasWallet) {
      return 60;
    }
    
    // 情况4: 仅选择硬件签名器 → 50%
    if (hasHardwareSigner && !hasWallet) {
      return 50;
    }
    
    // 情况1: 仅选择"不使用签名器" → 0%
    // 情况11: 什么都没选择 → 0%
    return 0;
  };

  // 处理用户偏好设置
  const handlePreferenceSet = (preference: UserPreference) => {
    setState(prev => {
      const newState = {
        ...prev,
        userPreference: preference,
        showGuide: false
      };
      
      // 如果用户选择了“暂时不用硬件签名器”，自动选中“不使用签名器”
      if (preference.signerWillingness === 'no-signer') {
        newState.selectedSigners = ['none'];
        newState.selectedWallet = null;
        newState.selectedNode = null;
      }
      
      return newState;
    });
    localStorage.setItem('userPreference', JSON.stringify(preference));
  };

  // 重置偏好
  const handleResetPreference = () => {
    setState(prev => ({
      ...prev,
      selectedSigners: [],
      selectedWallet: null,
      selectedNode: null,
      userPreference: null,
      showGuide: true
    }));
    localStorage.removeItem('userPreference');
  };

  // 如果数据还在加载中，显示加载状态
  if (state.isLoading || !state.custodyData) {
    return (
      <div className="App">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '1.2rem',
          color: '#666'
        }}>
          加载中...
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {state.showGuide && (
        <InitialGuide onPreferenceSet={handlePreferenceSet} />
      )}
      
      <Header 
        completionPercentage={getCompletionPercentage()}
        onResetPreference={handleResetPreference}
      />
      
      <MainLayout
        userPreference={state.userPreference}
        selectedSigners={state.selectedSigners}
        selectedWallet={state.selectedWallet}
        selectedNode={state.selectedNode}
        getComponentState={getComponentState}
        onComponentClick={handleComponentClick}
        custodyData={state.custodyData}
      />
      
      {/* 页面底部的三个特性框 - 与上方Grid列对齐 */}
      <div className="bottom-features three-column">
        {/* 硬件签名器特性框 */}
        {state.selectedSigners.length > 0 && (
          <div className="feature-box signer">
            <h4 className="feature-title">硬件签名器特性</h4>
            <div className="feature-list">
              {state.selectedSigners.map(signerId => {
                const signer = state.custodyData?.hardwareSigners.find(s => s.id === signerId);
                return signer?.features.map((feature, index) => (
                  <div key={`${signerId}-${index}`} className={`feature-item ${feature.type}`}>
                    <span className="feature-icon">{feature.type === 'positive' ? '✅' : feature.type === 'negative' ? '❌' : '⚠️'}</span>
                    <span className="feature-text">{feature.text}</span>
                  </div>
                ));
              })}
            </div>
          </div>
        )}
        
        {/* 软件钱包特性框 */}
        {state.selectedWallet && (
          <div className="feature-box wallet">
            <h4 className="feature-title">软件钱包特性</h4>
            <div className="feature-list">
              {(() => {
                const wallet = state.custodyData?.softwareWallets.find(w => w.id === state.selectedWallet);
                return wallet?.features.map((feature, index) => (
                  <div key={index} className={`feature-item ${feature.type}`}>
                    <span className="feature-icon">{feature.type === 'positive' ? '✅' : feature.type === 'negative' ? '❌' : '⚠️'}</span>
                    <span className="feature-text">{feature.text}</span>
                  </div>
                ));
              })()
              }
            </div>
          </div>
        )}
        
        {/* 区块链节点特性框 */}
        {state.selectedNode && (
          <div className="feature-box node">
            <h4 className="feature-title">区块链节点特性</h4>
            <div className="feature-list">
              {(() => {
                const node = state.custodyData?.nodes.find(n => n.id === state.selectedNode);
                return node?.features.map((feature, index) => (
                  <div key={index} className={`feature-item ${feature.type}`}>
                    <span className="feature-icon">{feature.type === 'positive' ? '✅' : feature.type === 'negative' ? '❌' : '⚠️'}</span>
                    <span className="feature-text">{feature.text}</span>
                  </div>
                ));
              })()
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;