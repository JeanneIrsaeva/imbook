// src/pages/ChatPage.jsx
import { useState, useMemo } from 'react';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatList from '@/components/chat/ChatList';
import ChatMessageList from '@/components/chat/ChatMessageList';
import ChatInput from '@/components/chat/ChatInput';
import { mockChatList, mockMessages } from '@/mocks/chat';

export default function ChatPage() {
  const [activeChatId, setActiveChatId] = useState(mockChatList[0]?.id);
  const [messages, setMessages] = useState(mockMessages);

  const activeChat = useMemo(
    () => mockChatList.find((c) => c.id === activeChatId),
    [activeChatId]
  );

  const handleSend = (text) => {
    const newMessage = {
      id: Date.now(),
      author: 'user',
      text,
      time: new Date().toLocaleDateString('ru-RU'),
    };

    setMessages((prev) => [...prev, newMessage]);

    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        author: 'character',
        text: 'Это демо-ответ. Когда подключим AI, здесь будет реальный ответ персонажа.',
        time: new Date().toLocaleDateString('ru-RU'),
        character: activeChat?.character,
      };
      setMessages((prev) => [...prev, reply]);
    }, 800);
  };

  return (
    <div className="max-w-[1700px] mx-auto pt-[50px] pb-12 px-10">
      <ChatHeader />

      <div className="grid grid-cols-1 lg:grid-cols-[500px_1fr] gap-12 mt-12
                      h-[873px]">
        <ChatList
          chats={mockChatList}
          activeId={activeChatId}
          onSelect={setActiveChatId}
        />

        <div className="flex flex-col h-full min-h-0">
          <div className="flex-1 min-h-0">
            <ChatMessageList messages={messages} />
          </div>

          <div className="pt-4">
            <ChatInput onSend={handleSend} />
          </div>
        </div>
      </div>
    </div>
  );
}