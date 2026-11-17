import ChatListItem from './ChatListItem';

export default function ChatList({ chats = [], activeId, onSelect }) {
  return (
    <aside className="flex flex-col gap-4 h-full overflow-y-auto">
      {chats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          isActive={chat.id === activeId}
          onClick={() => onSelect(chat.id)}
        />
      ))}
      {chats.length === 0 && (
        <p className="text-muted text-center py-8">Пока нет диалогов</p>
      )}
    </aside>
  );
}