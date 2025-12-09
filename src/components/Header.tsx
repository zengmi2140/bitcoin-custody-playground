import React, { useState } from 'react';

interface HeaderProps {
  completionPercentage: number;
  onResetPreference: () => void;
  onOpenFaq: () => void;
}

const Header: React.FC<HeaderProps> = ({ completionPercentage, onResetPreference, onOpenFaq }) => {
  const [isMultiSigTooltipVisible, setIsMultiSigTooltipVisible] = useState(false);
  const getProgressColor = (percentage: number): string => {
    if (percentage === 0) return '#fbbf24';   // 黄色 - 空状态
    if (percentage === 50) return '#ffcc80';  // 更浅橙色 - 仅选择硬件签名器
    if (percentage === 60) return '#ffb74d';  // 浅橙色 - "不使用签名器" + 软件钱包
    if (percentage === 80) return '#ffb74d';  // 浅橙色 - "不使用签名器" + 软件钱包 + 节点
    if (percentage === 100) return '#ffb74d'; // 浅橙色 - 硬件签名器 + 软件钱包
    if (percentage === 120) return '#F7931A'; // 比特币橙色 - 完整硬件配置
    return '#fbbf24'; // 默认黄色
  };

  // 判断是否显示庆祝emoji
  const showCelebration = completionPercentage === 120;
  // 判断是否显示灰色延伸区域
  const showGrayExtension = completionPercentage === 100;

  return (
    <header className="header">
      <div className="header-content">
        <div
          className="site-title"
          aria-label="比特币自主保管模拟器"
          role="heading"
          aria-level={1}
        >
          比特币自主保管模拟器
        </div>
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
        
        {/* 左上角重置按钮 */}
        <div className="header-actions-left">
          <button 
            className="reset-button"
            onClick={onResetPreference}
            title="重置偏好"
          >
            重置
          </button>
        </div>

        {/* 右上角按钮区域 */}
        <div className="header-actions">
          <button 
            className="faq-button"
            onClick={onOpenFaq}
            aria-label="查看 FAQ"
          >
            FAQ
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;