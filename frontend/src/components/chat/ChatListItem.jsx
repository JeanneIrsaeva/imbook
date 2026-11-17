export default function ChatListItem({ chat, isActive, onClick }) {
  const { character, lastMessage, date } = chat;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left bg-card border rounded-[10px] px-4 sm:px-[30px] py-5 sm:py-[26px] flex flex-col justify-center gap-2.5 transition-colors ${
        isActive
          ? 'border-gold ring-1 ring-gold'
          : 'border-border-medium hover:border-gold'
      }`}
    >
      <div className="flex items-center gap-4 sm:gap-5">
        <img
          src={character.avatar}
          alt={character.name}
          className="w-12 h-12 sm:w-[60px] sm:h-[60px] rounded-full object-cover shrink-0"
        />
        <span className="text-[16px] sm:text-[20px] font-bold text-ink truncate">
          {character.name}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 pl-2 sm:pl-20">
        <span className="text-[13px] sm:text-[16px] text-ink truncate flex-1">
          {lastMessage}
        </span>
        <span className="text-[13px] sm:text-[16px] text-ink shrink-0">{date}</span>
      </div>
    </button>
  );
}