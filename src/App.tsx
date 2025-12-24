import React, { useState, useEffect } from 'react';
import { UserPreference, ComponentState, CustodyData } from './types';
import Header from './components/Header';
import HeaderMobile from './components/HeaderMobile';
import FaqDrawer from './components/FaqDrawer';
import faqContent from './content/FAQ.md?raw';
import MainLayout from './components/MainLayout';
import InitialGuide from './components/InitialGuide';
import { useIsMobile } from './hooks/useIsMobile';
import './index.css';
import './App.css';

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
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [layoutBounds, setLayoutBounds] = useState<{ leftEdge: number; rightEdge: number } | null>(null);
  const isMobile = useIsMobile(769);

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
      // 已选中的签名器显示为active
      if (state.selectedSigners.includes(componentId)) return 'active';
      
      // 如果该列已有选中项，其他项不呼吸
      if (state.selectedSigners.length > 0) {
        return 'inactive';
      }
      
      // 特殊处理："不使用签名器"选项
      if (componentId === 'none') {
        // 如果用户选择了"愿意尝试硬件签名器"，则"不使用签名器"不呼吸
        if (state.userPreference.signerWillingness === 'with-signer') {
          return 'inactive';
        }
        // 如果用户选择了"暂不使用"，则"不使用签名器"正常呼吸
        return 'breathing';
      }
      
      // 检查与当前选择的钱包是否兼容（反向兼容）
      if (state.selectedWallet) {
        const wallet = state.custodyData.softwareWallets.find(w => w.id === state.selectedWallet);
        if (wallet && wallet.compatibleSigners.includes(componentId)) {
          return 'breathing';
        }
      }
      
      // 初始状态：如果用户选择了"愿意尝试硬件签名器"，硬件签名器列呼吸（除了"不使用签名器"）
      if (state.userPreference.signerWillingness === 'with-signer' && state.selectedWallet === null && state.selectedNode === null) {
        return 'breathing';
      }
      
      return 'inactive';
    }
    
    if (type === 'wallet') {
      // 已选中的钱包显示为active
      if (state.selectedWallet === componentId) return 'active';
      
      // 如果该列已有选中项，其他项不呼吸
      if (state.selectedWallet !== null) {
        return 'inactive';
      }
      
      const wallet = state.custodyData.softwareWallets.find(w => w.id === componentId);
      if (!wallet) return 'inactive';
      
      // 检查是否支持用户选择的设备类型
      if (!wallet.supportedPlatforms.some(platform => 
        platform.toLowerCase() === userDeviceType
      )) {
        return 'inactive';
      }
      
      // 检查与选择的签名器是否兼容（正向兼容）
      if (state.selectedSigners.length > 0) {
        // 如果选中的是"不使用签名器"，支持当前设备的钱包就呼吸
        if (state.selectedSigners.includes('none')) {
          return 'breathing';
        }
        // 如果选中的是其他硬件签名器，检查兼容性
        if (state.selectedSigners.some(signer => signer !== 'none' && wallet.compatibleSigners.includes(signer))) {
          return 'breathing';
        }
      }
      
      // 检查与当前选择的节点是否兼容（反向兼容）
      if (state.selectedNode) {
        const node = state.custodyData.nodes.find(n => n.id === state.selectedNode);
        if (node && node.compatibleWallets.includes(componentId)) {
          return 'breathing';
        }
      }
      
      return 'inactive';
    }
    
    if (type === 'node') {
      // 已选中的节点显示为active
      if (state.selectedNode === componentId) return 'active';
      
      // 如果该列已有选中项，其他项不呼吸
      if (state.selectedNode !== null) {
        return 'inactive';
      }
      
      // 检查与选择的钱包是否兼容（正向兼容）
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
    const currentState = getComponentState(componentId, type);
    
    // 如果点击的是非呼吸状态（inactive）的选项，执行重置逻辑
    if (currentState === 'inactive') {
      setState(prev => {
        // 重置所有选择
        const newState = {
          ...prev,
          selectedSigners: [],
          selectedWallet: null,
          selectedNode: null
        };
        
        // 根据点击的组件类型，设置相应的选择
        if (type === 'signer') {
          // 如果点击的是"不使用签名器"
          if (componentId === 'none') {
            const newPreference = {
              ...prev.userPreference!,
              signerWillingness: 'no-signer' as const
            };
            localStorage.setItem('userPreference', JSON.stringify(newPreference));
            
            return {
              ...newState,
              userPreference: newPreference,
              selectedSigners: [componentId]
            };
          } else {
            // 选择硬件签名器
            const newPreference = {
              ...prev.userPreference!,
              signerWillingness: 'with-signer' as const
            };
            localStorage.setItem('userPreference', JSON.stringify(newPreference));
            
            return {
              ...newState,
              userPreference: newPreference,
              selectedSigners: [componentId]
            };
          }
        } else if (type === 'wallet') {
          // 选择软件钱包
          return {
            ...newState,
            selectedWallet: componentId
          };
        } else if (type === 'node') {
          // 选择区块链节点
          return {
            ...newState,
            selectedNode: componentId
          };
        }
        
        return newState;
      });
      return;
    }
    
    // 如果点击的是呼吸状态（breathing）或已选中（active）的选项，执行级联选择逻辑
    if (type === 'signer') {
      setState(prev => {
        const isSelected = prev.selectedSigners.includes(componentId);
        
        if (isSelected) {
          // 取消选择
          return {
            ...prev,
            selectedSigners: prev.selectedSigners.filter(id => id !== componentId),
            selectedWallet: null,
            selectedNode: null
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
        if (prev.selectedWallet === componentId) {
          // 取消选择
          return {
            ...prev,
            selectedWallet: null,
            selectedNode: null
          };
        } else {
          // 选择新钱包
          return {
            ...prev,
            selectedWallet: componentId,
            selectedNode: null // 清除节点选择，重新开始级联
          };
        }
      });
    } else if (type === 'node') {
      setState(prev => {
        if (prev.selectedNode === componentId) {
          // 取消选择
          return {
            ...prev,
            selectedNode: null
          };
        } else {
          // 选择新节点
          return {
            ...prev,
            selectedNode: componentId
          };
        }
      });
    }
  };

  // 计算完成度
  const getCompletionPercentage = (): number => {
    if (!state.userPreference) return 0;
    
    // 新的进度计算逻辑：根据用户在Markdown文档中定义的规则
    const hasWallet = state.selectedWallet !== null;
    const hasSigner = state.selectedSigners.length > 0;
    // 修改：只有当选择的节点不是"默认/公开节点"时，才认为有真正的节点选择
    const hasNode = state.selectedNode !== null && state.selectedNode !== 'publicnode';
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

  const handleOpenFaq = () => {
    setIsFaqOpen(true);
  };

  const handleCloseFaq = () => {
    setIsFaqOpen(false);
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
      
      {isMobile ? (
        <HeaderMobile
          completionPercentage={getCompletionPercentage()}
          onResetPreference={handleResetPreference}
          onOpenFaq={handleOpenFaq}
        />
      ) : (
        <Header 
          completionPercentage={getCompletionPercentage()}
          onResetPreference={handleResetPreference}
          onOpenFaq={handleOpenFaq}
          layoutLeftEdge={layoutBounds?.leftEdge}
          layoutRightEdge={layoutBounds?.rightEdge}
        />
      )}
      
      <MainLayout
        userPreference={state.userPreference}
        selectedSigners={state.selectedSigners}
        selectedWallet={state.selectedWallet}
        selectedNode={state.selectedNode}
        getComponentState={getComponentState}
        onComponentClick={handleComponentClick}
        custodyData={state.custodyData}
        onLayoutMeasured={setLayoutBounds}
      />

      <FaqDrawer 
        isOpen={isFaqOpen}
        onClose={handleCloseFaq}
        content={faqContent}
      />
    </div>
  );
}

export default App;