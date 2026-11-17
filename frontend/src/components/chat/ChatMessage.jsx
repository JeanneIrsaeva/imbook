export default function ChatMessage({ message }) {
  const { author, text, time, character } = message;
  const isUser = author === 'user';

  return (
    <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && character && (
        <img
          src={character.avatar}
          alt={character.name}
          className="w-10 h-10 sm:w-[60px] sm:h-[60px] rounded-full object-cover shrink-0 mt-1"
        />
      )}

      <div
        className={`flex flex-col gap-2 max-w-[80%] sm:max-w-[674px] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        {!isUser && character && (
          <span className="text-[13px] sm:text-[16px] font-bold text-ink">
            {character.name}
          </span>
        )}

        <div
          className={`px-4 sm:px-6 py-3 sm:py-4 rounded-[10px] text-[15px] sm:text-[20px] leading-relaxed whitespace-pre-line ${
            isUser
              ? 'bg-gold text-white'
              : 'bg-white text-body border border-border-medium'
          }`}
          style={{
            boxShadow:
              '0 1px 2.29px rgba(0,0,0,0.13), 0 0.19px 0.57px rgba(0,0,0,0.11)',
          }}
        >
          {text}
        </div>

        <span className="text-[12px] sm:text-[14px] text-muted">{time}</span>
      </div>
    </div>
  );
}