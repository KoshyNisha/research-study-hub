import React from 'react';

const Card = ({
  children,
  className = '',
  hover = false,
  onClick
}) => {
  const baseStyles = 'bg-white rounded-xl border border-gray-200 overflow-hidden';
  const hoverStyles = hover
    ? 'transition-all duration-300 hover:shadow-lg hover:border-l-4 hover:border-l-[#FFCB05] cursor-pointer'
    : '';

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-gray-100 bg-gray-50 ${className}`}>
    {children}
  </div>
);

export default Card;
