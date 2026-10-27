// src/components/profile/ProfileAvatar.jsx
import { useRef } from 'react';

export default function ProfileAvatar({ src, name, onSelect, disabled = false }) {
  const inputRef = useRef(null);

  const handleClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onSelect) {
      onSelect(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <img
        src={src}
        alt={`Аватар ${name}`}
        className="w-[238px] h-[238px] rounded-full object-cover
                   border-2 border-[#E9E7DF]"
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`w-[199px] h-[61px]
                    border-2 border-[#C0C0C0]
                    flex items-center justify-center
                    text-[16px] tracking-[1.6px] uppercase
                    transition-colors
                    ${disabled
                      ? 'text-[#C0C0C0] cursor-not-allowed'
                      : 'text-ink hover:border-gold hover:text-gold'
                    }`}
      >
        Выбрать фото
      </button>
    </div>
  );
}