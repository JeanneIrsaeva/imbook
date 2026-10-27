// src/components/chat/ChatMessageList.jsx
import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

export default function ChatMessageList({ messages = [] }) {
  const endRef = useRef(null);

  // Автоскролл вниз при новых сообщениях
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto px-2 py-4
                    flex flex-col gap-8
                    [scrollbar-width:thin]">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      <div ref={endRef} />
    </div>
  );
}