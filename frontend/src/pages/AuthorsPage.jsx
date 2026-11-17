import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../api/client';
import AuthorCard from '../components/ui/AuthorCard';
import { toast } from 'sonner';

export default function AuthorsPage() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || '';
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/authors', { params: { only_global: true } })
      .then(r => setAuthors(r.data))
      .catch(() => toast.error('Ошибка'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = authors;
    if (q) {
      list = list.filter(a =>
        `${a.last_name} ${a.first_name}`.toLowerCase().includes(q)
      );
    }
    if (sort === 'title_asc') {
      list = [...list].sort((a, b) =>
        `${a.last_name} ${a.first_name}`.localeCompare(`${b.last_name} ${b.first_name}`, 'ru')
      );
    }
    if (sort === 'title_desc') {
      list = [...list].sort((a, b) =>
        `${b.last_name} ${b.first_name}`.localeCompare(`${a.last_name} ${a.first_name}`, 'ru')
      );
    }
    return list;
  }, [authors, search, sort]);

  return (
    <div className="max-w-[1700px] mx-auto py-8 md:py-12 px-4 md:px-10">
      <header className="flex flex-col items-center gap-2 mb-8 md:mb-12">
        <p className="text-[13px] tracking-[1.56px] text-muted uppercase text-center">Классификаторы</p>
        <div className="flex items-center justify-center gap-4 md:gap-[61px] w-full mt-6">
          <span className="h-px flex-1 md:w-[459px] bg-border-light" />
          <h1 className="text-3xl md:text-[48px] text-ink text-center leading-none whitespace-nowrap">
            Авторы{search && ` — «${search}»`}
          </h1>
          <span className="h-px flex-1 md:w-[459px] bg-border-light" />
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[34px]">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-full max-w-[326px] mx-auto animate-pulse">
              <div className="w-full aspect-square bg-card border border-book-border rounded-full" />
              <div className="h-6 bg-card w-3/4 mt-4 rounded mx-auto" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted text-xl py-16">
          {search ? 'Ничего не найдено' : 'Пока нет авторов'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[34px]">
          {filtered.map(a => (
            <AuthorCard key={a.id} item={{
              id: a.id,
              name: `${a.last_name} ${a.first_name}`,
              photo: a.photo || '/placeholder-avatar.png',
            }} />
          ))}
        </div>
      )}
    </div>
  );
}