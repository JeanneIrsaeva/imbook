// src/components/analytics/StatsCard.jsx
export default function StatsCard({ label, value }) {
  return (
    <div className="flex-1 min-w-0
                    bg-[#EDEBE4] border border-[#94928B]
                    px-6 py-8 rounded-md">
      <p className="text-[24px] text-[#7A7A7A] font-quicksand leading-[33.6px]">
        {label}
      </p>
      <p className="text-[40px] text-[#21272A] font-quicksand leading-[44px] mt-2">
        {value}
      </p>
    </div>
  );
}