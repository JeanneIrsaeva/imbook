import { useEffect, useState } from 'react';
import ChatHeader from '@components/chat/ChatHeader';
import ChatList from '@components/chat/ChatList';
import ChatMessageList from '@components/chat/ChatMessageList';
import ChatInput from '@components/chat/ChatInput';
import apiClient from '../api/client';
import { toast } from 'sonner';

export default function ChatPage() {
  const [dialogs, setDialogs] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await apiClient.get('/chat/dialogs');
        setDialogs(data);
        if (data[0]) setActiveId(data[0].id);
      } catch {
        toast.error('Не удалось загрузить диалоги');
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!activeId) return;
    const dialog = dialogs.find((d) => d.id === activeId);
    setMessages(dialog?.messages || []);
  }, [activeId, dialogs]);

  const handleSend = async (text) => {
    if (!activeId || sending) return;
    setSending(true);
    try {
      const { data } = await apiClient.post(`/chat/dialogs/${activeId}/messages`, { text });
      setMessages((prev) => [...prev, data.user_message, data.character_message]);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Ошибка отправки');
    } finally {
      setSending(false);
    }
  };

  const chatList = dialogs.map((d) => ({
    id: d.id,
    character: {
      name: d.character.name,
      avatar: d.character.photo || '/placeholder-avatar.png',  // <-- фото из БД
    },
    lastMessage: d.messages[d.messages.length - 1]?.text || '',
    date: new Date(d.started_at).toLocaleDateString('ru-RU'),
  }));

  const activeDialog = dialogs.find((d) => d.id === activeId);
  const displayMessages = messages.map((m) => ({
    id: m.id,
    author: m.sender === 'user' ? 'user' : 'character',
    text: m.text,
    time: new Date(m.created_at).toLocaleDateString('ru-RU'),
    character: activeDialog
      ? {
          name: activeDialog.character.name,
          avatar: activeDialog.character.photo || '/placeholder-avatar.png',  // <-- фото из БД
        }
      : null,
  }));

  return (
    <div className="max-w-[1700px] mx-auto pt-8 md:pt-[50px] pb-8 md:pb-12 px-4 md:px-10">
      <ChatHeader />
      <div className="grid grid-cols-1 lg:grid-cols-[500px_1fr] gap-6 md:gap-12 mt-8 md:mt-12 h-auto lg:h-[873px]">
        <ChatList chats={chatList} activeId={activeId} onSelect={setActiveId} />
        <div className="flex flex-col h-full min-h-0">
          <div className="flex-1 min-h-0">
            <ChatMessageList messages={displayMessages} />
          </div>
          <div className="pt-4">
            <ChatInput onSend={handleSend} disabled={sending} />
          </div>
        </div>
      </div>
    </div>
  );
}