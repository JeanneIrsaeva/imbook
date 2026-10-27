// src/components/analytics/LegendList.jsx
export default function LegendList({ items = [] }) {
  return (
    <ul className="flex flex-col gap-4 w-full">
      {items.map(({ id, label, value, percent, color }) => (
        <li key={id} className="flex items-center justify-between gap-4">
          {/* Левая часть: точка + название */}
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="w-4 h-4 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-[24px] text-[#21272A] leading-[33.6px] truncate">
              {label}
            </span>
          </div>

          {/* Правая часть: число + бейдж с процентом */}
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-[24px] text-[#697077] font-quicksand leading-[33.6px]">
              {value}
            </span>
            <span className="inline-flex items-center justify-center
                             w-16 h-9 rounded
                             bg-[#9A874B] text-white
                             text-[18px] font-quicksand leading-none">
              {percent}%
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}