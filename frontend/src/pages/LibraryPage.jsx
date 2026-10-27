// src/pages/LibraryPage.jsx
import { useState, useMemo } from 'react';
import LibraryHeader from '@/components/library/LibraryHeader';
import LibraryTabs from '@/components/library/LibraryTabs';
import BookCard from '@/components/ui/BookCard';
import Shelf from '@/components/home/Shelf';
import EmptyState from '@/components/library/EmptyState';
import { mockLibraryBooks } from '@/mocks/home';

// Соответствие «таб → статус книги»
const TAB_TO_STATUS = {
  all: null,
  planned: 'planned',
  reading: 'reading',
  read: 'read',
};

// Сколько карточек в ряду
const CARDS_PER_ROW = 4;

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState('all');

  // Фильтруем книги по активному табу
  const filteredBooks = useMemo(() => {
    const statusFilter = TAB_TO_STATUS[activeTab];
    if (!statusFilter) return mockLibraryBooks;
    return mockLibraryBooks.filter((book) => book.status === statusFilter);
  }, [activeTab]);

  // Разбиваем на ряды по CARDS_PER_ROW
  const rows = useMemo(() => {
    const result = [];
    for (let i = 0; i < filteredBooks.length; i += CARDS_PER_ROW) {
      result.push(filteredBooks.slice(i, i + CARDS_PER_ROW));
    }
    return result;
  }, [filteredBooks]);

  return (
    <div className="max-w-[1700px] mx-auto py-12 px-10">
      <LibraryHeader />

      <LibraryTabs activeTab={activeTab} onChange={setActiveTab} />

      {filteredBooks.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <div className="flex flex-col gap-12">
          {rows.map((rowBooks, rowIndex) => (
            <div key={rowIndex}>
              {/* Сетка карточек в ряду */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[34px]">
                {rowBooks.map((book) => (
                  <BookCard key={book.id} item={book} />
                ))}
              </div>

              {/* Полка под каждым рядом */}
              <div className="mt-6">
                <Shelf />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}