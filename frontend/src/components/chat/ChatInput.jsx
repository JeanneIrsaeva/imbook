import { useState } from 'react';
import SendIcon from '@assets/icons/send.svg?react';

export default function ChatInput({ onSend, disabled = false }) {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const hasText = text.trim().length > 0;
  const isActive = isFocused || hasText;

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`border-2 rounded-[12px] p-1 transition-colors duration-200 ${
        isActive ? 'border-gold' : 'border-border-medium'
      }`}
    >
      <div
        className="bg-white rounded-[10px] h-[80px] sm:h-[104px] flex items-center px-4 sm:px-6 gap-3 sm:gap-4 transition-shadow duration-200"
        style={{
          boxShadow: isActive
            ? '0 0 1px rgba(154,136,76,0.4), 0 1px 3px rgba(0,0,0,0.08)'
            : '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Напишите сообщение..."
          disabled={disabled}
          className="flex-1 bg-transparent outline-none text-[15px] sm:text-[18px] text-ink placeholder:text-placeholder disabled:opacity-60"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!hasText || disabled}
          aria-label="Отправить"
          className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full transition-colors ${
            hasText && !disabled
              ? 'bg-gold text-white hover:bg-gold-hover'
              : 'bg-paper-dark text-muted cursor-not-allowed'
          }`}
        >
          <SendIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>
  );
}