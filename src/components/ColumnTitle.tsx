import React from 'react';

interface ColumnTitleProps {
  title: string;
  icon?: React.ReactNode;
}

const ColumnTitle = React.forwardRef<HTMLHeadingElement, ColumnTitleProps>(({ title, icon }, ref) => {
  return (
    <h2 className="column-title" ref={ref} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
      {title}
      {icon}
    </h2>
  );
});

ColumnTitle.displayName = 'ColumnTitle';

export default ColumnTitle;