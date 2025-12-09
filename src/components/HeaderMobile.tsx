import React from 'react';

interface HeaderMobileProps {
  completionPercentage: number;
  onResetPreference: () => void;
  onOpenFaq: () => void;
}

const HeaderMobile: React.FC<HeaderMobileProps> = ({
  completionPercentage,
  onResetPreference,
  onOpenFaq
}) => {
  const getProgressColor = (percentage: number): string => {
    if (percentage === 0) return '#fbbf24';
    if (percentage === 50) return '#ffcc80';
    if (percentage === 60) return '#ffb74d';
    if (percentage === 80) return '#ffb74d';
    if (percentage === 100) return '#ffb74d';
    if (percentage === 120) return '#F7931A';
    return '#fbbf24';
  };

  const showCelebration = completionPercentage === 120;
  const showGrayExtension = completionPercentage === 100;

  return (
    <header className="header-mobile">
      <div className="header-mobile__content">
        <button
          className="header-mobile__icon header-mobile__icon--left"
          onClick={onResetPreference}
          aria-label="重置偏好"
          title="重置"
        >
          ↺
        </button>

        <button
          className="header-mobile__icon header-mobile__icon--right"
          onClick={onOpenFaq}
          aria-label="查看 FAQ"
          title="FAQ"
        >
          ?
        </button>

        <div className="header-mobile__title" aria-label="比特币自主保管模拟器">
          比特币自主保管模拟器
        </div>

        <div className="header-mobile__progress">
          <div className={`progress-bar-container ${showGrayExtension ? 'extended' : ''}`}>
            <div
              className={`progress-bar ${completionPercentage === 100 ? 'at-hundred' : ''}`}
              style={{
                width: `${completionPercentage >= 100 && completionPercentage < 120 ? 83.33 : completionPercentage === 120 ? 100 : completionPercentage}%`,
                backgroundColor: getProgressColor(completionPercentage)
              }}
            />
            <div className="progress-percentage">{completionPercentage}%</div>
          </div>
          {showCelebration && <div className="celebration-emoji">🎉</div>}
        </div>
      </div>
    </header>
  );
};

export default HeaderMobile;
