import React, { useState } from 'react';

interface HeaderProps {
  completionPercentage: number;
  onResetPreference: () => void;
}

const Header: React.FC<HeaderProps> = ({ completionPercentage, onResetPreference }) => {
  const [isMultiSigTooltipVisible, setIsMultiSigTooltipVisible] = useState(false);
  const getProgressColor = (percentage: number): string => {
    if (percentage === 0) return '#fbbf24'; // 黄色 - 空状态
    if (percentage === 50) return '#10b981'; // 浅绿色 - 仅选择硬件签名器
    if (percentage === 60) return '#059669'; // 深绿色 - "不使用签名器" + 软件钱包
    if (percentage === 80) return '#16a34a'; // 更深绿色 - "不使用签名器" + 软件钱包 + 节点
    if (percentage === 100) return '#059669'; // 深绿色 - 硬件签名器 + 软件钱包
    if (percentage === 120) return '#3b82f6'; // 蓝色 - 完整配置 + 庆祝效果
    return '#fbbf24'; // 默认黄色
  };

  // 判断是否显示庆祝emoji
  const showCelebration = completionPercentage === 120;
  // 判断是否显示灰色延伸区域
  const showGrayExtension = completionPercentage === 100;

  return (
    <header className="header">
      <div className="header-content">
        {/* 中央进度条区域 */}
        <div className="progress-section">
          <div className={`progress-bar-container ${showGrayExtension ? 'extended' : ''}`}>
            <div 
              className={`progress-bar ${completionPercentage === 100 ? 'at-hundred' : ''}`}
              style={{
                width: `${completionPercentage >= 100 && completionPercentage < 120 ? 83.33 : completionPercentage === 120 ? 100 : completionPercentage}%`,
                backgroundColor: getProgressColor(completionPercentage)
              }}
            />
            <div className="progress-percentage">
              {completionPercentage}%
            </div>
          </div>
          {/* 庆祝emoji */}
          {showCelebration && (
            <div className="celebration-emoji">
              🎉
            </div>
          )}
        </div>
        
        {/* 右上角按钮区域 */}
        <div className="header-actions">
          <div className="signature-mode-selector">
            <button className="signature-mode-button active">
              单签
            </button>
            <button 
              className="signature-mode-button disabled"
              onMouseEnter={() => setIsMultiSigTooltipVisible(true)}
              onMouseLeave={() => setIsMultiSigTooltipVisible(false)}
            >
              多签
              {isMultiSigTooltipVisible && (
                <div className="tooltip">
                  等待上线
                </div>
              )}
            </button>
          </div>
          
          <button 
            className="reset-button"
            onClick={onResetPreference}
            title="重置偏好"
          >
            重置
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;