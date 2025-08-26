import { useMemo } from 'react';
import componentsData from '@/data/components.json';

interface Component {
  id: string;
  name: string;
  logo: string;
  compatibleWallets?: string[];
  compatibleSigners?: string[];
  compatibleNodes?: string[];
}

interface ComponentGridProps {
  type: 'hardwareSigners' | 'softwareWallets' | 'nodes';
  title: string;
  selectedComponents: {
    hardwareSigner?: string;
    softwareWallet?: string;
    node?: string;
  };
  onSelect: (componentId: string, type: string) => void;
  layout: 'two-column' | 'three-column';
}

export function ComponentGrid({ type, title, selectedComponents, onSelect, layout }: ComponentGridProps) {
  const components = componentsData[type] as Component[];
  
  // Skip hardware signers in two-column layout
  if (layout === 'two-column' && type === 'hardwareSigners') {
    return null;
  }

  const getComponentState = useMemo(() => {
    return (component: Component) => {
      const currentTypeSelected = selectedComponents[
        type === 'hardwareSigners' ? 'hardwareSigner' : 
        type === 'softwareWallets' ? 'softwareWallet' : 'node'
      ];
      
      // If this component is selected
      if (currentTypeSelected === component.id) {
        return 'selected';
      }

      // Check if any other components are selected
      const hasOtherSelections = Object.values(selectedComponents).some(Boolean);
      
      if (!hasOtherSelections) {
        return 'dimmed'; // Default state when nothing is selected
      }

      // Check compatibility based on other selections
      let isCompatible = true;

      if (type === 'hardwareSigners') {
        // Check if compatible with selected wallet
        if (selectedComponents.softwareWallet) {
          isCompatible = component.compatibleWallets?.includes(selectedComponents.softwareWallet) ?? false;
        }
      } else if (type === 'softwareWallets') {
        // Check if compatible with selected signer and/or node
        if (selectedComponents.hardwareSigner) {
          isCompatible = component.compatibleSigners?.includes(selectedComponents.hardwareSigner) ?? false;
        }
        if (selectedComponents.node && isCompatible) {
          isCompatible = component.compatibleNodes?.includes(selectedComponents.node) ?? false;
        }
      } else if (type === 'nodes') {
        // Check if compatible with selected wallet
        if (selectedComponents.softwareWallet) {
          isCompatible = component.compatibleWallets?.includes(selectedComponents.softwareWallet) ?? false;
        }
      }

      return isCompatible ? 'breathing' : 'dimmed';
    };
  }, [selectedComponents, type]);

  const handleComponentClick = (component: Component) => {
    const currentTypeSelected = selectedComponents[
      type === 'hardwareSigners' ? 'hardwareSigner' : 
      type === 'softwareWallets' ? 'softwareWallet' : 'node'
    ];
    
    // If clicking the same component, deselect it
    if (currentTypeSelected === component.id) {
      onSelect('', type);
    } else {
      onSelect(component.id, type);
    }
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="bg-card rounded-lg border border-border p-6 h-full">
        <h2 className="text-xl font-semibold text-foreground mb-6 text-center">{title}</h2>
        <div className="grid gap-4">
          {components.map((component) => {
            const state = getComponentState(component);
            const stateClass = 
              state === 'selected' ? 'component-selected' :
              state === 'breathing' ? 'component-breathing' :
              'component-dimmed';

            return (
              <div
                key={component.id}
                className={`p-4 rounded-lg border border-border bg-muted/50 transition-all duration-300 ${stateClass}`}
                onClick={() => handleComponentClick(component)}
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={component.logo} 
                    alt={component.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-foreground">{component.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {type === 'hardwareSigners' && '硬件签名器'}
                      {type === 'softwareWallets' && '软件钱包'}
                      {type === 'nodes' && '区块链节点'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}