// src/components/ui/SliderDots.jsx
export default function SliderDots({ count, activeIndex, onDotClick }) {
  if (count <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 h-[30px]">
      {Array.from({ length: count }).map((_, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onDotClick?.(index)}
            aria-label={`Перейти к слайду ${index + 1}`}
            aria-current={isActive}
            className="relative flex items-center justify-center
                       transition-all duration-300"
            style={{ width: isActive ? 30 : 10, height: 30 }}
          >
            {isActive && (
              <span className="absolute inset-0 rounded-full
                               border border-[#D7D5CC]" />
            )}
            <span
              className={`rounded-full transition-colors duration-300 ${
                isActive
                  ? 'w-[10px] h-[10px] bg-[#74642F]'
                  : 'w-[10px] h-[10px] bg-[#D7D5CC] hover:bg-[#B8B5A8]'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}