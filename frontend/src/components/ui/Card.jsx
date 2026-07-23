import React from 'react';

const Card = ({
  children,
  className = '',
  hoverable = true,
  padding = true,
  ...props
}) => {
  const paddingClass = padding ? 'card-body' : '';
  const flatClass = hoverable ? '' : 'card--flat';

  return (
    <div className={`card ${flatClass} ${paddingClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`card-header ${className}`}>{children}</div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`card-body ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`card-footer ${className}`}>{children}</div>
);

export default Card;
