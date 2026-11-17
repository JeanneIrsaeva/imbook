import { useRef } from 'react';

export default function ProfileAvatar({ src, name, onSelect, disabled = false }) {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelect(file);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className={`relative w-[200px] h-[200px] md:w-[240px] md:h-[240px] rounded-full overflow-hidden border-4 border-paper shadow-lg group ${
          !disabled ? 'cursor-pointer' : ''
        }`}
        onClick={handleClick}
      >
        <img 
          src={src} 
          alt={name} 
          className="w-full h-full object-cover" 
        />
        
        {/* Оверлей при наведении для редактирования */}
        {!disabled && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-[14px] font-medium tracking-wider">
              Изменить
            </span>
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      
      <h3 className="text-[24px] text-ink font-serif text-center leading-tight">
        {name}
      </h3>
    </div>
  );
}