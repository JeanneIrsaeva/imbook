import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../../api/client';

const FILTERS_BY_PATH = {
  '/catalog': ['sort', 'genre', 'author', 'year'],
  '/library': ['sort'],
  '/authors': ['sort'],
  '/publishers': ['sort'],
  '/characters': ['sort'],
};

export default function FiltersPanel({ open, onClose }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const path = window.location.pathname;

  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [localFilters, setLocalFilters] = useState({
    sort: searchParams.get('sort') || '',
    genre: searchParams.get('genre') || '',
    author: searchParams.get('author') || '',
    year: searchParams.get('year') || '',
    status: '',
  });

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      try {
        const [g, a] = await Promise.all([
          apiClient.get('/genres', { params: { only_global: true } }),
          apiClient.get('/authors', { params: { only_global: true } }),
        ]);
        setGenres(g.data);
        setAuthors(a.data);
      } catch {}
    };
    load();
  }, [open]);

  useEffect(() => {
    setLocalFilters({
      sort: searchParams.get('sort') || '',
      genre: searchParams.get('genre') || '',
      author: searchParams.get('author') || '',
      year: searchParams.get('year') || '',
      status: '',
    });
  }, [open]);

  if (!open) return null;

  const available = FILTERS_BY_PATH[path] || [];

  const applyFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(localFilters).forEach(([k, v]) => {
      if (v) newParams.set(k, v);
      else newParams.delete(k);
    });
    ['sort', 'genre', 'author', 'year', 'status'].forEach(k => {
      if (!available.includes(k)) newParams.delete(k);
    });
    setSearchParams(newParams);
    onClose();
  };

  const resetFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    ['sort', 'genre', 'author', 'year', 'status'].forEach(k => newParams.delete(k));
    setSearchParams(newParams);
    setLocalFilters({ sort: '', genre: '', author: '', year: '', status: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />

      <aside className="relative w-full max-w-[400px] h-full bg-paper border-l border-border-medium flex flex-col">
        <header className="flex items-center justify-between px-6 py-5 border-b border-border-light">
          <h2 className="text-xl font-serif text-ink">Фильтры</h2>
          <button onClick={onClose} className="text-muted hover:text-ink text-2xl leading-none">×</button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {available.includes('sort') && (
            <label className="flex flex-col gap-1 text-sm text-muted">
              Сортировка
              <select
                value={localFilters.sort}
                onChange={e => setLocalFilters({ ...localFilters, sort: e.target.value })}
                className="h-[45px] px-3 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold"
              >
                <option value="">По умолчанию</option>
                <option value="title_asc">Название (А-Я)</option>
                <option value="title_desc">Название (Я-А)</option>
                {path === '/catalog' && <option value="year_desc">Год (новые сначала)</option>}
                {path === '/catalog' && <option value="year_asc">Год (старые сначала)</option>}
                {path === '/library' && <option value="progress_desc">Прогресс (больше)</option>}
                {path === '/library' && <option value="progress_asc">Прогресс (меньше)</option>}
              </select>
            </label>
          )}

          {available.includes('genre') && (
            <label className="flex flex-col gap-1 text-sm text-muted">
              Жанр
              <select
                value={localFilters.genre}
                onChange={e => setLocalFilters({ ...localFilters, genre: e.target.value })}
                className="h-[45px] px-3 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold"
              >
                <option value="">Любой</option>
                {genres.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
              </select>
            </label>
          )}

          {available.includes('author') && (
            <label className="flex flex-col gap-1 text-sm text-muted">
              Автор
              <select
                value={localFilters.author}
                onChange={e => setLocalFilters({ ...localFilters, author: e.target.value })}
                className="h-[45px] px-3 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold"
              >
                <option value="">Любой</option>
                {authors.map(a => (
                  <option key={a.id} value={a.id}>{a.last_name} {a.first_name}</option>
                ))}
              </select>
            </label>
          )}

          {available.includes('year') && (
            <label className="flex flex-col gap-1 text-sm text-muted">
              Год издания
              <input
                type="number"
                value={localFilters.year}
                onChange={e => setLocalFilters({ ...localFilters, year: e.target.value })}
                placeholder="Например, 1984"
                className="h-[45px] px-3 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold"
              />
            </label>
          )}
        </div>

        <footer className="px-6 py-4 border-t border-border-light flex gap-3">
          <button onClick={resetFilters} className="flex-1 h-[45px] border-2 border-border-dark rounded-lg uppercase text-sm">
            Сбросить
          </button>
          <button onClick={applyFilters} className="flex-1 h-[45px] bg-gold text-white rounded-lg uppercase text-sm hover:bg-gold-hover">
            Применить
          </button>
        </footer>
      </aside>
    </div>
  );
}