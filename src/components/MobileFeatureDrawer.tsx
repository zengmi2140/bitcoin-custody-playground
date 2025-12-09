import React, { useEffect, useState } from 'react';
import { Feature } from '../types';
import './MobileFeatureDrawer.css';

interface MobileFeatureDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  features: Feature[];
}

const MobileFeatureDrawer: React.FC<MobileFeatureDrawerProps> = ({
  isOpen,
  onClose,
  title,
  features
}) => {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      // Small delay to allow render before animation
      requestAnimationFrame(() => {
        setAnimating(true);
      });
    } else {
      setAnimating(false);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 300); // Match CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div className={`mobile-drawer-overlay ${animating ? 'open' : ''}`} onClick={onClose}>
      <div 
        className={`mobile-drawer-content ${animating ? 'open' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="mobile-drawer-header">
          <div className="mobile-drawer-handle" />
          <h3 className="mobile-drawer-title">{title}</h3>
          <button className="mobile-drawer-close" onClick={onClose}>×</button>
        </div>
        <div className="mobile-drawer-body">
          <div className="feature-list">
            {features.map((feature, index) => (
              <div key={index} className={`feature-item ${feature.type}`}>
                <span className="feature-icon">
                  {feature.type === 'positive' ? '✅' : feature.type === 'negative' ? '❌' : '⚠️'}
                </span>
                <span className="feature-text">{feature.text}</span>
              </div>
            ))}
            {features.length === 0 && (
              <div className="empty-features">暂无特性描述</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFeatureDrawer;
