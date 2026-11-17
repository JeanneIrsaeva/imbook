import { useState } from 'react';
import AdminBooks from '../components/admin/AdminBooks';
import AdminAuthors from '../components/admin/AdminAuthors';
import AdminGenres from '../components/admin/AdminGenres';
import AdminPublishers from '../components/admin/AdminPublishers';
import AdminCharacters from '../components/admin/AdminCharacters';

const TABS = [
  { id: 'books', label: 'Книги' },
  { id: 'authors', label: 'Авторы' },
  { id: 'genres', label: 'Жанры' },
  { id: 'publishers', label: 'Издательства' },
  { id: 'characters', label: 'Персонажи' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('books');

  return (
    <div className="max-w-[1700px] mx-auto py-8 md:py-12 px-4 md:px-10">
      <header className="flex flex-col items-center gap-2 mb-8">
        <p className="text-[13px] tracking-[1.56px] text-muted uppercase">Управление системой</p>
        <div className="flex items-center justify-center gap-4 md:gap-[61px] w-full mt-6">
          <span className="h-px flex-1 md:w-[459px] bg-border-light" />
          <h1 className="text-3xl md:text-[48px] text-ink text-center">Админ-панель</h1>
          <span className="h-px flex-1 md:w-[459px] bg-border-light" />
        </div>
      </header>

      <nav className="flex items-center justify-center gap-4 md:gap-8 mb-12 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-6 py-2 text-[16px] tracking-[0.64px] transition-colors ${
              activeTab === t.id ? 'text-gold border-b-2 border-gold' : 'text-muted hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {activeTab === 'books' && <AdminBooks />}
      {activeTab === 'authors' && <AdminAuthors />}
      {activeTab === 'genres' && <AdminGenres />}
      {activeTab === 'publishers' && <AdminPublishers />}
      {activeTab === 'characters' && <AdminCharacters />}
    </div>
  );
}