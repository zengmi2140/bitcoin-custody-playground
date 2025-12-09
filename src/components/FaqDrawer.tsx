import React, { useEffect, useRef } from 'react';
import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';

interface FaqDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

const markdownComponents: Components = {
  h2: ({ children }) => (
    <h2 className="faq-heading">
      <span className="faq-heading-icon">Q</span>
      <span className="faq-heading-text">{children}</span>
    </h2>
  ),
  p: ({ children }) => <p className="faq-paragraph">{children}</p>,
  ul: ({ children }) => <ul className="faq-list">{children}</ul>,
  ol: ({ children }) => <ol className="faq-list faq-list-ordered">{children}</ol>,
  li: ({ children }) => <li className="faq-list-item">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="faq-quote">{children}</blockquote>
  ),
  strong: ({ children }) => <strong className="faq-strong">{children}</strong>
};

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
          <div className="faq-content">
            <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqDrawer;
