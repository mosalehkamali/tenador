'use client';

export default function IconButton({ 
  children, 
  onClick, 
  className = '',
  ariaLabel,
  variant = 'default'
}) {
  const variants = {
    default: 'hover:bg-black/20',
    primary: 'hover:bg-[#aa4725]/20 hover:text-[#aa4725]',
    ghost: 'hover:scale-110',
  };
  
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`p-2 rounded transition-all duration-300 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
