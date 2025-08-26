import { useMemo } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import componentsData from '@/data/components.json';

interface Feature {
  type: 'positive' | 'negative' | 'warning';
  text: string;
}

interface Component {
  id: string;
  name: string;
  features: Feature[];
}

interface FeatureDisplayProps {
  selectedComponents: {
    hardwareSigner?: string;
    softwareWallet?: string;
    node?: string;
  };
  layout: 'two-column' | 'three-column';
}

export function FeatureDisplay({ selectedComponents, layout }: FeatureDisplayProps) {
  const getComponentFeatures = (type: string, id?: string): { name: string; features: Feature[] } | null => {
    if (!id) return null;
    
    const components = componentsData[type as keyof typeof componentsData] as Component[];
    const component = components.find(c => c.id === id);
    
    return component ? { name: component.name, features: component.features } : null;
  };

  const signerData = layout === 'three-column' ? 
    getComponentFeatures('hardwareSigners', selectedComponents.hardwareSigner) : null;
  const walletData = getComponentFeatures('softwareWallets', selectedComponents.softwareWallet);
  const nodeData = getComponentFeatures('nodes', selectedComponents.node);

  const hasAnySelection = signerData || walletData || nodeData;

  const getFeatureIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  if (!hasAnySelection) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <h2 className="text-xl font-semibold text-foreground mb-4">特性展示</h2>
          <p className="text-muted-foreground">选择组件以查看详细特性和兼容性信息</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6 text-center">特性展示</h2>
        
        <div className={`grid gap-6 ${layout === 'two-column' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
          {/* Hardware Signer Column */}
          {layout === 'three-column' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground text-center border-b border-border pb-2">
                硬件签名器
              </h3>
              {signerData ? (
                <div>
                  <h4 className="font-medium text-primary mb-3">{signerData.name}</h4>
                  <div className="space-y-2">
                    {signerData.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        {getFeatureIcon(feature.type)}
                        <span className="text-sm text-foreground">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center">未选择硬件签名器</p>
              )}
            </div>
          )}

          {/* Software Wallet Column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-center border-b border-border pb-2">
              软件钱包
            </h3>
            {walletData ? (
              <div>
                <h4 className="font-medium text-primary mb-3">{walletData.name}</h4>
                <div className="space-y-2">
                  {walletData.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      {getFeatureIcon(feature.type)}
                      <span className="text-sm text-foreground">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center">未选择软件钱包</p>
            )}
          </div>

          {/* Blockchain Node Column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-center border-b border-border pb-2">
              区块链节点
            </h3>
            {nodeData ? (
              <div>
                <h4 className="font-medium text-primary mb-3">{nodeData.name}</h4>
                <div className="space-y-2">
                  {nodeData.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      {getFeatureIcon(feature.type)}
                      <span className="text-sm text-foreground">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center">未选择区块链节点</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}