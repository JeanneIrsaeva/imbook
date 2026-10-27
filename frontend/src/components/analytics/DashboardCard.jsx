// src/components/analytics/DashboardCard.jsx
export default function DashboardCard({ title, children, className = '' }) {
  return (
    <section
      className={`
        bg-[#EDEBE4] border border-[#94928B]
        p-4 flex flex-col gap-4 rounded-md
        ${className}
      `}
    >
      <h2 className="text-[40px] text-[#21272A] leading-[44px]">
        {title}
      </h2>
      <div className="flex-1">
        {children}
      </div>
    </section>
  );
}