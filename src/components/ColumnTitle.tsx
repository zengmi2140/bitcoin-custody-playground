import React from 'react';

interface ColumnTitleProps {
  title: string;
}

const ColumnTitle = React.forwardRef<HTMLHeadingElement, ColumnTitleProps>(({ title }, ref) => {
  return (
    <h2 className="column-title" ref={ref}>
      {title}
    </h2>
  );
});

ColumnTitle.displayName = 'ColumnTitle';

export default ColumnTitle;