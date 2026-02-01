
import React, { useState } from 'react';
import RulesModal from './RulesModal';

const RulesAgreement = ({ checked, onChange }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-[6px] border border-gray-200 p-6 shadow-md mb-6">
      <label className="flex items-center gap-3 cursor-pointer group">
        <input 
          type="checkbox" 
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-5 h-5 accent-[var(--color-primary)] cursor-pointer"
        />
        <span className="text-sm text-gray-700 select-none">
         تمامی <button 
            type="button"
            onClick={(e) => { e.preventDefault(); setModalOpen(true); }}
            className="text-[var(--color-primary)] font-bold hover:underline"
          >قوانین</button> را می‌پذیرم.
        </span>
      </label>

      <RulesModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onAccept={() => onChange(true)} 
      />
    </div>
  );
};

export default RulesAgreement;
