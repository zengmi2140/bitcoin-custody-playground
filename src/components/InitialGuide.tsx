import React, { useState } from 'react';
import { UserPreference } from '../types';

interface InitialGuideProps {
  onPreferenceSet: (preference: UserPreference) => void;
}

const InitialGuide: React.FC<InitialGuideProps> = ({ onPreferenceSet }) => {
  const [step, setStep] = useState<'device' | 'signer'>('device');
  const [deviceType, setDeviceType] = useState<'mobile' | 'desktop' | null>(null);

  const handleDeviceChoice = (choice: 'mobile' | 'desktop') => {
    setDeviceType(choice);
    setStep('signer');
  };

  const handleSignerChoice = (choice: 'no-signer' | 'with-signer') => {
    if (deviceType) {
      onPreferenceSet({
        deviceType,
        signerWillingness: choice
      });
    }
  };

  return (
    <div className="initial-guide-overlay">
      <div className="initial-guide">
        {step === 'device' && (
          <div className="guide-step">
            <h2>欢迎使用比特币自主保管模拟器</h2>
            <p>首先，请告诉我们您主要使用什么设备来管理比特币：</p>
            
            <div className="choice-cards">
              <button 
                className="choice-card"
                onClick={() => handleDeviceChoice('mobile')}
              >
                <div className="choice-icon">📱</div>
                <div className="choice-title">手机</div>
                <div className="choice-description">我希望使用手机来联网</div>
              </button>
              
              <button 
                className="choice-card"
                onClick={() => handleDeviceChoice('desktop')}
              >
                <div className="choice-icon">💻</div>
                <div className="choice-title">电脑</div>
                <div className="choice-description">我使用电脑来联网</div>
              </button>
            </div>
          </div>
        )}

        {step === 'signer' && (
          <div className="guide-step">
            <h2>关于硬件签名器</h2>
            <p>硬件签名器可以提供更高的安全性，但需要额外的学习和设备投入。您的态度是：</p>
            
            <div className="choice-cards">
              <button 
                className="choice-card"
                onClick={() => handleSignerChoice('no-signer')}
              >
                <div className="choice-icon">📱</div>
                <div className="choice-title">暂不使用</div>
                <div className="choice-description">我不想使用专门的签名器</div>
              </button>
              
              <button 
                className="choice-card"
                onClick={() => handleSignerChoice('with-signer')}
              >
                <div className="choice-icon">🔒</div>
                <div className="choice-title">愿意尝试</div>
                <div className="choice-description">我愿意尝试硬件签名器</div>
              </button>
            </div>
          </div>
        )}

        <div className="guide-progress">
          <div className={`progress-dot ${step === 'device' ? 'active' : 'completed'}`} />
          <div className={`progress-dot ${step === 'signer' ? 'active' : ''}`} />
        </div>
      </div>
    </div>
  );
};

export default InitialGuide;