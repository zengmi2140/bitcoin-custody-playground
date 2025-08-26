import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, Monitor, Shield, Wallet } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (preferences: { layout: 'two-column' | 'three-column' }) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    device: '',
    signer: ''
  });

  const handleDeviceChoice = (device: string) => {
    setPreferences(prev => ({ ...prev, device }));
    setStep(2);
  };

  const handleSignerChoice = (signer: string) => {
    const finalPreferences = { ...preferences, signer };
    
    // Determine layout based on signer preference
    const layout = signer === 'no-signer' ? 'two-column' : 'three-column';
    
    // Save to localStorage
    localStorage.setItem('bitcoin-ecosystem-preferences', JSON.stringify({
      ...finalPreferences,
      layout,
      hasCompletedOnboarding: true
    }));
    
    onComplete({ layout });
  };

  if (step === 1) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-border shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">欢迎使用比特币生态系统指南</CardTitle>
            <CardDescription className="text-muted-foreground">
              让我们了解你的使用偏好，为你定制最佳体验
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-muted-foreground mb-6">
              你希望使用哪种设备联网？
            </p>
            <div className="grid gap-3">
              <Button
                variant="outline"
                size="lg"
                className="justify-start gap-3 h-16 bg-card hover:bg-accent"
                onClick={() => handleDeviceChoice('mobile')}
              >
                <Smartphone className="h-6 w-6 text-primary" />
                <div className="text-left">
                  <div className="font-medium">我希望使用手机来联网</div>
                  <div className="text-sm text-muted-foreground">移动设备优先的体验</div>
                </div>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="justify-start gap-3 h-16 bg-card hover:bg-accent"
                onClick={() => handleDeviceChoice('desktop')}
              >
                <Monitor className="h-6 w-6 text-primary" />
                <div className="text-left">
                  <div className="font-medium">我使用电脑来联网</div>
                  <div className="text-sm text-muted-foreground">桌面设备优先的体验</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-foreground">安全偏好设置</CardTitle>
          <CardDescription className="text-muted-foreground">
            选择最适合你的安全方案
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground mb-6">
            你是否愿意使用专门的签名器？
          </p>
          <div className="grid gap-3">
            <Button
              variant="outline"
              size="lg"
              className="justify-start gap-3 h-16 bg-card hover:bg-accent"
              onClick={() => handleSignerChoice('no-signer')}
            >
              <Wallet className="h-6 w-6 text-primary" />
              <div className="text-left">
                <div className="font-medium">我不想使用专门的签名器</div>
                <div className="text-sm text-muted-foreground">软件钱包 + 区块链节点</div>
              </div>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="justify-start gap-3 h-16 bg-card hover:bg-accent"
              onClick={() => handleSignerChoice('hardware-signer')}
            >
              <Shield className="h-6 w-6 text-primary" />
              <div className="text-left">
                <div className="font-medium">我愿意尝试硬件签名器</div>
                <div className="text-sm text-muted-foreground">硬件 + 软件 + 节点</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}