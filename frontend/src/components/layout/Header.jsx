// src/components/layout/Header.jsx
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import SearchIcon from '@/assets/icons/search.svg?react';
import SlidersIcon from '@/assets/icons/sliders.svg?react';
import BellIcon from '@/assets/icons/bell.svg?react';
import avatar from '@/assets/images/avatar.png';

export default function Header() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  const hasText = query.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/catalog?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <header className="w-full px-10 py-6 bg-paper flex items-center gap-8">

      {/* Поиск — используем group для отслеживания focus-within */}
      <form
        onSubmit={handleSubmit}
        className="group flex-1 min-w-0
                   flex items-center h-[60px] px-6 gap-4
                   bg-paper-dark rounded-[25px]
                   border border-black/[0.07]
                   shadow-[0_4px_4px_rgba(0,0,0,0.25)]
                   transition-colors duration-200"
      >
        {/* Лупа: золотая, если фокус ИЛИ есть текст */}
        <SearchIcon
          className={`w-[30px] h-[30px] shrink-0
                      transition-colors duration-200
                      group-focus-within:text-gold
                      ${hasText ? 'text-gold' : 'text-ink'}`}
        />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск книги по названию, автору"
          className="flex-1 min-w-0 bg-transparent outline-none
                     text-[16px] text-[#111111]
                     placeholder:text-[#111111]/60
                     font-sans"
        />

        <button
          type="button"
          aria-label="Фильтры"
          className="shrink-0 transition-colors duration-200
                     text-ink hover:text-gold"
        >
          <SlidersIcon className="w-[30px] h-[30px]" />
        </button>
      </form>

      {/* Профиль */}
      <Link
        to="/profile"
        className="flex items-center gap-3 shrink-0
                   px-3 py-1.5 rounded-full
                   transition-colors duration-200
                   hover:bg-paper-dark no-underline
                   text-ink hover:text-gold"
      >
        <img src={avatar} alt="Аватар"
             className="w-[60px] h-[60px] rounded-full object-cover" />
        <span className="text-[20px]">Жанна</span>
      </Link>

      {/* Уведомления */}
      <button
        type="button"
        aria-label="Уведомления"
        className="shrink-0 transition-colors duration-200
                   text-ink hover:text-gold"
      >
        <BellIcon className="w-[40px] h-[40px]" />
      </button>
    </header>
  );
}