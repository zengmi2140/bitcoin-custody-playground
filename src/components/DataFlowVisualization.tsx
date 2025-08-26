import { useMemo } from 'react';

interface DataFlowVisualizationProps {
  selectedComponents: {
    hardwareSigner?: string;
    softwareWallet?: string;
    node?: string;
  };
  layout: 'two-column' | 'three-column';
}

export function DataFlowVisualization({ selectedComponents, layout }: DataFlowVisualizationProps) {
  const { signerToWallet, nodeToWallet } = useMemo(() => {
    const { hardwareSigner, softwareWallet, node } = selectedComponents;
    
    return {
      signerToWallet: !!(hardwareSigner && softwareWallet),
      nodeToWallet: !!(node && softwareWallet)
    };
  }, [selectedComponents]);

  if (layout === 'two-column') {
    return (
      <div className="absolute inset-0 pointer-events-none">
        {/* Node to Wallet arrow */}
        <svg className="w-full h-full">
          <defs>
            <marker
              id="arrowhead-two-col"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                className={nodeToWallet ? 'fill-primary' : 'fill-muted-foreground'}
              />
            </marker>
          </defs>
          
          {/* Horizontal arrow from nodes to wallets */}
          <line
            x1="75%"
            y1="50%"
            x2="25%"
            y2="50%"
            className={nodeToWallet ? 'data-flow-active' : 'data-flow-inactive'}
            markerEnd="url(#arrowhead-two-col)"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full">
        <defs>
          <marker
            id="arrowhead-signer"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              className={signerToWallet ? 'fill-primary' : 'fill-muted-foreground'}
            />
          </marker>
          <marker
            id="arrowhead-node"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              className={nodeToWallet ? 'fill-primary' : 'fill-muted-foreground'}
            />
          </marker>
        </defs>
        
        {/* Hardware Signer to Software Wallet arrow */}
        <line
          x1="22%"
          y1="50%"
          x2="44%"
          y2="50%"
          className={signerToWallet ? 'data-flow-active' : 'data-flow-inactive'}
          markerEnd="url(#arrowhead-signer)"
        />
        
        {/* Blockchain Node to Software Wallet arrow */}
        <line
          x1="78%"
          y1="50%"
          x2="56%"
          y2="50%"
          className={nodeToWallet ? 'data-flow-active' : 'data-flow-inactive'}
          markerEnd="url(#arrowhead-node)"
        />
        
        {/* Data flow labels */}
        {signerToWallet && (
          <text
            x="33%"
            y="45%"
            className="fill-primary text-xs"
            textAnchor="middle"
          >
            公钥/签名
          </text>
        )}
        
        {nodeToWallet && (
          <text
            x="67%"
            y="45%"
            className="fill-primary text-xs"
            textAnchor="middle"
          >
            区块链数据
          </text>
        )}
      </svg>
    </div>
  );
}