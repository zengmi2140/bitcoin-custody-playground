import React from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import MainLayoutDesktop from './MainLayoutDesktop';
import MainLayoutMobile from './MainLayoutMobile';
import { UserPreference, ComponentState, CustodyData } from '../types';

interface MainLayoutProps {
  userPreference: UserPreference | null;
  selectedSigners: string[];
  selectedWallet: string | null;
  selectedNode: string | null;
  getComponentState: (componentId: string, type: 'signer' | 'wallet' | 'node') => ComponentState;
  onComponentClick: (componentId: string, type: 'signer' | 'wallet' | 'node') => void;
  custodyData: CustodyData;
  onLayoutMeasured?: (bounds: { leftEdge: number; rightEdge: number }) => void;
}

const MainLayout: React.FC<MainLayoutProps> = (props) => {
  const isMobile = useIsMobile(769);

  if (isMobile) {
    return <MainLayoutMobile {...props} />;
  }

  return <MainLayoutDesktop {...props} />;
};

export default MainLayout;
