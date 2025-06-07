import React from 'react';

interface ButtonProps {
  children?: React.ReactNode;
  text?: string;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  variant = 'primary',
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  fullWidth = false,
}) => {
  const baseClasses = 'py-2 px-4 rounded-md focus:outline-none focus:ring-2 disabled:opacity-50 transition-colors';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'bg-gray-300 text-gray-700 hover:bg-gray-400 focus:ring-gray-500 hover:cursor-pointer',
  };

  const widthClass = fullWidth ? 'flex-1' : '';
  
  const finalClassName = `${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`.trim();

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={finalClassName}
    >
      {text}
    </button>
  );
};