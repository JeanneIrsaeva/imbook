// src/components/book/StarRating.jsx
import StarIcon from '@/assets/icons/star.svg?react';

export default function StarRating({ value = 0, max = 5, size = 24 }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: max }).map((_, i) => (
        <StarIcon
          key={i}
          width={size}
          height={size}
          className={i < value ? 'text-[#9A884C]' : 'text-[#D7D5CC]'}
        />
      ))}
    </div>
  );
}