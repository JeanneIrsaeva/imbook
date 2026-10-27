// src/mocks/chat.js
import charDolarhyde from '@/assets/images/characters/francis-dolarhyde.png';

// Список чатов (левая колонка)
export const mockChatList = [
  {
    id: 1,
    character: {
      id: 1,
      name: 'Фрэнсис Долархайд',
      book: 'Красный Дракон',
      avatar: charDolarhyde,
    },
    lastMessage: 'ТЕКСТ :)',
    date: '03.05.2026',
  },
  {
    id: 2,
    character: {
      id: 1,
      name: 'Фрэнсис Долархайд',
      book: 'Красный Дракон',
      avatar: charDolarhyde,
    },
    lastMessage: 'ТЕКСТ текст :)',
    date: '03.06.2026',
  },
];

// Сообщения активного чата
export const mockMessages = [
  {
    id: 1,
    author: 'character',                // 'character' | 'user'
    text: 'ТЕКСТ ТЕКСТ ТЕКСТ ТЕКСТ ТЕКСТТЕКСТТЕКСТ ТЕКСТ ТЕКСТ ТЕКСТТЕКСТТЕКСТТЕКСТТЕКСТ ТЕКСТ\nТЕКСТ',
    time: '03.05.2026',
    character: {
      name: 'Фрэнсис Долархайд',
      avatar: charDolarhyde,
    },
  },
  {
    id: 2,
    author: 'user',
    text: 'ТЕКСТ :)',
    time: '03.05.2026',
  },
  {
    id: 3,
    author: 'character',
    text: 'Ещё один ответ от персонажа. Я думаю, что...',
    time: '03.05.2026',
    character: {
      name: 'Фрэнсис Долархайд',
      avatar: charDolarhyde,
    },
  },
  {
    id: 4,
    author: 'user',
    text: 'Интересно! Расскажи подробнее.',
    time: '03.05.2026',
  },
];