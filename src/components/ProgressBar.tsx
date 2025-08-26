import { useMemo } from 'react';

interface ProgressBarProps {
  selectedComponents: {
    hardwareSigner?: string;
    softwareWallet?: string;
    node?: string;
  };
  layout: 'two-column' | 'three-column';
}

export function ProgressBar({ selectedComponents, layout }: ProgressBarProps) {
  const { progress, color, label } = useMemo(() => {
    const { hardwareSigner, softwareWallet, node } = selectedComponents;
    
    if (layout === 'two-column') {
      // Two-column mode logic
      if (softwareWallet && node) {
        return { progress: 120, color: 'progress-blue', label: '超额完成' };
      } else if (softwareWallet) {
        return { progress: 100, color: 'progress-deep-green', label: '完成' };
      } else {
        return { progress: 0, color: 'progress-yellow', label: '开始选择' };
      }
    } else {
      // Three-column mode logic
      if (hardwareSigner && softwareWallet && node) {
        return { progress: 120, color: 'progress-blue', label: '超额完成' };
      } else if (hardwareSigner && softwareWallet) {
        return { progress: 100, color: 'progress-deep-green', label: '完成' };
      } else if (softwareWallet) {
        return { progress: 50, color: 'progress-light-green', label: '进行中' };
      } else {
        return { progress: 0, color: 'progress-yellow', label: '开始选择' };
      }
    }
  }, [selectedComponents, layout]);

  // Calculate visual progress (100% mark at 80% of bar width)
  const visualProgress = Math.min((progress / 120) * 100, 100);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-foreground">配置完成度</span>
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      
      <div className="relative">
        {/* Background bar */}
        <div className="h-4 bg-muted rounded-full overflow-hidden">
          {/* Progress fill */}
          <div 
            className={`h-full transition-all duration-700 ease-out ${color}`}
            style={{ width: `${visualProgress}%` }}
          />
        </div>
        
        {/* 100% marker at 80% position */}
        <div className="absolute top-0 left-[80%] w-0.5 h-4 bg-foreground/30" />
        <div className="absolute -top-6 left-[80%] transform -translate-x-1/2">
          <span className="text-xs text-muted-foreground">100%</span>
        </div>
        
        {/* Current progress percentage */}
        <div className="mt-2 text-center">
          <span className="text-lg font-bold text-foreground">{progress}%</span>
        </div>
      </div>
    </div>
  );
}