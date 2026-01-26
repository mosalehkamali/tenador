'use client';

export default function Input({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  className = '',
  icon,
  name,
  required = false
}) {
  return (
    <div className="relative w-full">
      {icon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-4 py-3 bg-white/5 border border-black/20 
          placeholder-gray-600
          focus:outline-none focus:border-[#aa4725] focus:ring-1 focus:ring-[#aa4725]
          transition-all duration-300 rounded-[var(--radius)]
          ${icon ? 'pr-11' : ''}
          ${className}
        `}
      />
    </div>
  );
}
