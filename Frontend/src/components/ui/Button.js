import React from 'react';

const Button = ({ children, className, variant }) => {
  const variantClass = variant === 'outline' ? 'border border-blue-600 text-blue-600' : 'bg-blue-600 text-white';
  return (
    <button className={`${variantClass} ${className} p-3 rounded-lg`}>
      {children}
    </button>
  );
};

export default Button;
