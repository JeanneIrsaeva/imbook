// src/components/profile/ProfileField.jsx
import { useState } from 'react';

export default function ProfileField({
  label,
  value,
  editable = false,
  name,
  type = 'text',
  onChange,
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`
        border-2 rounded-[20px]
        px-5 py-3 min-h-[82px]
        flex flex-col justify-center
        transition-colors duration-200
        ${isFocused
          ? 'border-gold'
          : 'border-[#94928B]'
        }
      `}
    >
      {/* Label — меняет цвет при фокусе */}
      <span
        className={`
          text-[18px] font-serif
          transition-colors duration-200
          ${isFocused ? 'text-gold' : 'text-[#181821]'}
        `}
      >
        {label}
      </span>

      {editable ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="text-[18px] font-medium text-[#181821] mt-1
                     bg-transparent outline-none w-full"
        />
      ) : (
        <span className="text-[18px] font-medium text-[#181821] mt-1">
          {value}
        </span>
      )}
    </div>
  );
}