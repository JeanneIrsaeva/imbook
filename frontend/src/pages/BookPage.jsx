// src/pages/BookPage.jsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import BookHeader from '@/components/book/BookHeader';
import BookMeta from '@/components/book/BookMeta';
import BookTabs from '@/components/book/BookTabs';
import ProgressCircle from '@/components/book/ProgressCircle';
import StarRating from '@/components/book/StarRating';
import TrashIcon from '@/assets/icons/trash.svg?react';
import ChevronDownIcon from '@/assets/icons/chevron-down.svg?react';
import { mockBookDetails } from '@/mocks/home';

export default function BookPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('description');

  // Пока используем мок, но с подстановкой id из URL
  const book = { ...mockBookDetails, id };

  return (
    <div className="max-w-[1700px] mx-auto py-12 px-10">
      <BookHeader />

      <div className="grid grid-cols-1 lg:grid-cols-[519px_1fr] gap-16 mt-12">
        {/* ==== ЛЕВАЯ КОЛОНКА: обложка + управление ==== */}
        <div className="flex flex-col items-center gap-12">
          {/* Обложка */}
          <div className="w-[519px] h-[708px] bg-paper border border-[#E9E7DF]
                          flex items-center justify-center">
            <img
              src={book.cover}
              alt={`Обложка «${book.title}»`}
              className="max-w-[85%] max-h-[85%] object-contain shadow-2xl"
            />
          </div>

          {/* Панель управления: корзина + статус + прогресс */}
          <div className="flex items-center justify-between w-[413px]">
            <button
              type="button"
              aria-label="Удалить книгу"
              className="w-[60px] h-[60px] flex items-center justify-center
                         text-ink hover:text-red-600 transition-colors"
            >
              <TrashIcon className="w-10 h-10" />
            </button>

            <button
              type="button"
              className="w-[197px] h-[61px] border-2 border-[#C0C0C0]
                         flex items-center justify-center gap-3
                         text-[16px] tracking-[1.6px] uppercase
                         text-ink hover:border-gold hover:text-gold
                         transition-colors"
            >
              <span>Статус</span>
              <ChevronDownIcon className="w-3 h-3" />
            </button>

            <ProgressCircle value={book.progress} size={60} />
          </div>
        </div>

        {/* ==== ПРАВАЯ КОЛОНКА: инфо ==== */}
        <div className="flex flex-col gap-8">
          {/* Название */}
          <h1 className="text-[48px] text-ink leading-tight">
            {book.title}
          </h1>

          {/* Рейтинг звёздами */}
          <div className="flex items-center gap-4">
            <span className="text-[24px] text-[#9A884C] font-medium">
              {book.ratingValue}
            </span>
            <StarRating value={book.rating} size={24} />
          </div>

          {/* Метаданные */}
          <BookMeta book={book} />

          {/* Табы: Описание / Заметки / Цитаты */}
          <div className="mt-4">
            <BookTabs activeTab={activeTab} onChange={setActiveTab} />
          </div>

          {/* Контент таба */}
          <div className="bg-[#EDEBE4] border border-[#94928B]
                          p-8 min-h-[235px]">
            {activeTab === 'description' && (
              <p className="text-[20px] leading-relaxed text-[#000] tracking-[0.8px]">
                {book.description}
              </p>
            )}
            {activeTab === 'notes' && (
              <p className="text-[20px] text-[#7A7A7A]">
                Заметок пока нет.
              </p>
            )}
            {activeTab === 'quotes' && (
              <p className="text-[20px] text-[#7A7A7A]">
                Цитат пока нет.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Кнопка «Назад» — внизу страницы */}
      <div className="mt-16 flex justify-center">
        <Link
          to="/library"
          className="text-[16px] text-gold hover:underline"
        >
          ← Вернуться в библиотеку
        </Link>
      </div>
    </div>
  );
}