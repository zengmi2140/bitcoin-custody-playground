import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { OnboardingFlow } from '@/components/OnboardingFlow';
import { ProgressBar } from '@/components/ProgressBar';
import { ComponentGrid } from '@/components/ComponentGrid';
import { FeatureDisplay } from '@/components/FeatureDisplay';
import { DataFlowVisualization } from '@/components/DataFlowVisualization';
import { RotateCcw, Bitcoin } from 'lucide-react';

const Index = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [layout, setLayout] = useState<'two-column' | 'three-column'>('three-column');
  const [selectedComponents, setSelectedComponents] = useState<{
    hardwareSigner?: string;
    softwareWallet?: string;
    node?: string;
  }>({});

  useEffect(() => {
    // Check if user has completed onboarding
    const savedPreferences = localStorage.getItem('bitcoin-ecosystem-preferences');
    if (savedPreferences) {
      const preferences = JSON.parse(savedPreferences);
      if (preferences.hasCompletedOnboarding) {
        setLayout(preferences.layout);
      } else {
        setShowOnboarding(true);
      }
    } else {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = (preferences: { layout: 'two-column' | 'three-column' }) => {
    setLayout(preferences.layout);
    setShowOnboarding(false);
  };

  const handleComponentSelect = (componentId: string, type: string) => {
    setSelectedComponents(prev => {
      const newState = { ...prev };
      
      if (type === 'hardwareSigners') {
        newState.hardwareSigner = componentId || undefined;
      } else if (type === 'softwareWallets') {
        newState.softwareWallet = componentId || undefined;
      } else if (type === 'nodes') {
        newState.node = componentId || undefined;
      }
      
      return newState;
    });
  };

  const handleResetPreferences = () => {
    localStorage.removeItem('bitcoin-ecosystem-preferences');
    setSelectedComponents({});
    setShowOnboarding(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {showOnboarding && (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      )}
      
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bitcoin className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">比特币自主托管生态系统</h1>
                <p className="text-sm text-muted-foreground">探索硬件签名器、软件钱包和区块链节点的完美组合</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetPreferences}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              重置偏好
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <section className="container mx-auto px-4 py-8">
        <ProgressBar 
          selectedComponents={selectedComponents}
          layout={layout}
        />
      </section>

      {/* Main Component Grid */}
      <section className="container mx-auto px-4 pb-8">
        <div className="relative">
          <div className={`grid gap-6 ${layout === 'two-column' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 lg:grid-cols-3'}`}>
            <ComponentGrid
              type="hardwareSigners"
              title="硬件签名器"
              selectedComponents={selectedComponents}
              onSelect={handleComponentSelect}
              layout={layout}
            />
            <ComponentGrid
              type="softwareWallets"
              title="软件钱包"
              selectedComponents={selectedComponents}
              onSelect={handleComponentSelect}
              layout={layout}
            />
            <ComponentGrid
              type="nodes"
              title="区块链节点"
              selectedComponents={selectedComponents}
              onSelect={handleComponentSelect}
              layout={layout}
            />
          </div>
          
          {/* Data Flow Visualization */}
          <DataFlowVisualization
            selectedComponents={selectedComponents}
            layout={layout}
          />
        </div>
      </section>

      {/* Feature Display */}
      <section className="container mx-auto px-4 pb-12">
        <FeatureDisplay
          selectedComponents={selectedComponents}
          layout={layout}
        />
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            比特币自主托管生态系统指南 - 帮助您找到最适合的安全保管方案
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;