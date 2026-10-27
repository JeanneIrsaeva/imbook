// src/components/library/LibraryTabs.jsx
import { useState } from 'react';

const TABS = [
  { id: 'all',        label: 'Все' },
  { id: 'planned',    label: 'Планирую' },
  { id: 'reading',    label: 'Читаю' },
  { id: 'read',       label: 'Прочитано' },
];

export default function LibraryTabs({ activeTab = 'all', onChange }) {
  const [internalActive, setInternalActive] = useState(activeTab);

  const active = onChange ? activeTab : internalActive;

  const handleClick = (id) => {
    if (onChange) onChange(id);
    else setInternalActive(id);
  };

  return (
    <nav className="flex items-center justify-center gap-0 mb-12">
      {TABS.map(({ id, label }) => {
        const isActive = id === active;

        return (
          <button
            key={id}
            type="button"
            onClick={() => handleClick(id)}
            className={`
              relative px-8 py-3
              text-[16px] tracking-[0.64px]
              transition-colors
              ${isActive ? 'text-[#7A7A7A]' : 'text-[#999999] hover:text-[#7A7A7A]'}
            `}
          >
            {label}

            {/* Золотая линия под активным табом */}
            {isActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2
                               w-[82px] h-[2px] bg-[#9A874B]" />
            )}
          </button>
        );
      })}
    </nav>
  );
}