// src/components/book/BookTabs.jsx
const TABS = [
  { id: 'description', label: 'Описание' },
  { id: 'notes',       label: 'Заметки' },
  { id: 'quotes',      label: 'Цитаты' },
];

export default function BookTabs({ activeTab, onChange }) {
  return (
    <div className="flex items-center justify-center gap-8 border-b border-transparent">
      {TABS.map(({ id, label }) => {
        const isActive = id === activeTab;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`
              relative pb-3 text-[24px] tracking-[0.96px]
              transition-colors
              ${isActive ? 'text-[#111111]' : 'text-[#999999] hover:text-[#7A7A7A]'}
            `}
          >
            {label}
            {isActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2
                               w-[128px] h-[2px] bg-[#9A874B]" />
            )}
          </button>
        );
      })}
    </div>
  );
}