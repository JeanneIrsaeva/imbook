// src/components/chat/ChatMessage.jsx
export default function ChatMessage({ message }) {
  const { author, text, time, character } = message;
  const isUser = author === 'user';

  return (
    <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Аватар персонажа — только слева */}
      {!isUser && character && (
        <img
          src={character.avatar}
          alt={character.name}
          className="w-[60px] h-[60px] rounded-full object-cover shrink-0 mt-1"
        />
      )}

      {/* Пузырь сообщения */}
      <div className={`flex flex-col gap-2 max-w-[674px]
                       ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Имя персонажа — только над сообщениями AI */}
        {!isUser && character && (
          <span className="text-[16px] font-bold text-[#181821]">
            {character.name}
          </span>
        )}

        <div
          className={`
            px-6 py-4 rounded-[10px]
            text-[20px] leading-relaxed whitespace-pre-line
            ${isUser
              ? 'bg-[#9A874B] text-white'
              : 'bg-white text-[#181821CC] border border-[#94928B]'
            }
          `}
          style={{
            boxShadow: '0 1px 2.29px rgba(0,0,0,0.13), 0 0.19px 0.57px rgba(0,0,0,0.11)',
          }}
        >
          {text}
        </div>

        {/* Время */}
        <span className="text-[14px] text-[#7A7A7A]">{time}</span>
      </div>
    </div>
  );
}