'use client';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  className = '',
  disabled = false,
  type = 'button'
}) {
  const baseStyles = 'font-medium transition-all duration-300 border-2';
  
  const variants = {
    primary: 'bg-[#aa4725] border-[#aa4725] text-white hover:bg-transparent hover:text-[#aa4725] rounded-[var(--radius)]',
    secondary: 'bg-[#ffbf00] border-[#ffbf00] text-[#0d0d0d] hover:bg-transparent hover:text-[#ffbf00]',
    outline: 'bg-transparent border-black/20 hover:bg-[#0d0d0d] hover:text-[#fff]',
    ghost: 'bg-transparent border-transparent hover:border-[#aa4725] hover:text-[#aa4725]',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {children}
    </button>
  );
}
