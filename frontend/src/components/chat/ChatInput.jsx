// src/components/chat/ChatInput.jsx
import { useState } from 'react';
import SendIcon from '@/assets/icons/send.svg?react';

export default function ChatInput({ onSend }) {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const hasText = text.trim().length > 0;
  const isActive = isFocused || hasText;

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
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
      className={`
        border-2 rounded-[12px] p-1
        transition-colors duration-200
        ${isActive ? 'border-gold' : 'border-[#94928B]'}
      `}
    >
      <div
        className="bg-white rounded-[10px]
                   h-[104px] flex items-center px-6 gap-4
                   transition-shadow duration-200"
        style={{
          boxShadow: isActive
            ? '0 0 0 1px rgba(154, 136, 76, 0.4), 0 1px 3px rgba(0,0,0,0.08)'
            : '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        {/* Текстовое поле */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Введите сообщение"
          rows={1}
          className="flex-1 resize-none bg-transparent outline-none
                     text-[24px] text-[#424242] placeholder:text-[#424242]
                     max-h-[80px] py-2
                     [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        />

        {/* Отправить */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!hasText}
          aria-label="Отправить"
          className="shrink-0 transition-colors duration-200
                     text-ink hover:text-gold
                     disabled:text-ink disabled:opacity-40
                     disabled:hover:text-ink disabled:cursor-not-allowed"
        >
          <SendIcon className="w-[50px] h-[50px]" />
        </button>
      </div>
    </div>
  );
}