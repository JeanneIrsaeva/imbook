// src/components/chat/ChatList.jsx
import ChatListItem from './ChatListItem';

export default function ChatList({ chats = [], activeId, onSelect }) {
  return (
    <aside className="flex flex-col gap-1.5 h-[873px] overflow-y-auto pr-1
                      [scrollbar-width:thin]">
      {chats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          isActive={chat.id === activeId}
          onClick={() => onSelect(chat.id)}
        />
      ))}
    </aside>
  );
}