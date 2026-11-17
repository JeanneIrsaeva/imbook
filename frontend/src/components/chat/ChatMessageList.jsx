import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

export default function ChatMessageList({ messages = [] }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="h-full overflow-y-auto flex flex-col gap-6 px-2 py-4">
      {messages.map((m) => (
        <ChatMessage key={m.id} message={m} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}