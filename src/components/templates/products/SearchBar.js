// SearchBar.jsx
import { FaSearch } from "react-icons/fa";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative group">
      <input
        type="text"
        placeholder="جستجوی نام راکت، برند، SKU..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 pr-12 pl-4 bg-gray-50 border border-gray-100 rounded-[6px] text-sm font-bold outline-none focus:border-[#aa4725] focus:bg-white transition-all shadow-inner"
      />
      <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#aa4725] transition-colors" />
    </div>
  );
}