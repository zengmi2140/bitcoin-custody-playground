import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface FaqDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

const FaqDrawer: React.FC<FaqDrawerProps> = ({ isOpen, onClose, content }) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    drawerRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="faq-overlay"
      role="presentation"
      onClick={handleOverlayClick}
    >
      <div 
        className="faq-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="常见问题"
        tabIndex={-1}
        ref={drawerRef}
      >
        <div className="faq-header">
          <h2 className="faq-title">FAQ</h2>
          <button 
            className="faq-close"
            aria-label="关闭 FAQ"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="faq-body">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default FaqDrawer;
