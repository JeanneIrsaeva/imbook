// src/components/analytics/AnalyticsHeader.jsx
export default function AnalyticsHeader() {
  return (
    <header className="flex flex-col items-center gap-2 mb-12 w-full">
      {/* Надзаголовок */}
      <p className="text-[13px] tracking-[1.56px] text-[#7A7A7A]
                    uppercase text-center">
        Аналитика чтения
      </p>

      {/* Заголовок с линиями на всю ширину */}
      <div className="flex items-center gap-[61px] w-full mt-6">
        <span className="h-px flex-1 bg-[#E0E0E0]" />
        <h1 className="text-[48px] text-ink text-center leading-none whitespace-nowrap">
          Аналитика
        </h1>
        <span className="h-px flex-1 bg-[#E0E0E0]" />
      </div>
    </header>
  );
}