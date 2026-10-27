// src/components/chat/ChatListItem.jsx
export default function ChatListItem({ chat, isActive, onClick }) {
  const { character, lastMessage, date } = chat;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full text-left
        bg-[#EDEBE4] border rounded-[10px]
        h-[141px] px-[30px] py-[26px]
        flex flex-col justify-center gap-2.5
        transition-colors
        ${isActive
          ? 'border-[#9A874B] ring-1 ring-[#9A874B]'
          : 'border-[#94928B] hover:border-[#9A874B]'
        }
      `}
    >
      {/* Верхняя строка: аватар + имя */}
      <div className="flex items-center gap-5">
        <img
          src={character.avatar}
          alt={character.name}
          className="w-[60px] h-[60px] rounded-full object-cover shrink-0"
        />
        <span className="text-[20px] font-bold text-[#181821]">
          {character.name}
        </span>
      </div>

      {/* Нижняя строка: превью + дата */}
      <div className="flex items-center justify-between gap-3 pl-20">
        <span className="text-[16px] text-[#181821] truncate flex-1">
          {lastMessage}
        </span>
        <span className="text-[16px] text-[#181821] shrink-0">
          {date}
        </span>
      </div>
    </button>
  );
}