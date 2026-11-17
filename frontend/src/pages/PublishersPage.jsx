import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../api/client';
import PublisherCard from '../components/ui/PublisherCard';
import { toast } from 'sonner';

export default function PublishersPage() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('q') || '';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/publishers', { params: { only_global: true } })
      .then(r => setItems(r.data))
      .catch(() => toast.error('Ошибка'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(p => p.name.toLowerCase().includes(q));
  }, [items, search]);

  return (
    <div className="max-w-[1700px] mx-auto py-8 md:py-12 px-4 md:px-10">
      <header className="flex flex-col items-center gap-2 mb-8 md:mb-12">
        <p className="text-[13px] tracking-[1.56px] text-muted uppercase text-center">Классификаторы</p>
        <div className="flex items-center justify-center gap-4 md:gap-[61px] w-full mt-6">
          <span className="h-px flex-1 md:w-[459px] bg-border-light" />
          <h1 className="text-3xl md:text-[48px] text-ink text-center leading-none whitespace-nowrap">
            Издательства{search && ` — «${search}»`}
          </h1>
          <span className="h-px flex-1 md:w-[459px] bg-border-light" />
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[34px]">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-full max-w-[438px] mx-auto animate-pulse">
              <div className="w-full aspect-[438/328] bg-card border border-book-border" />
              <div className="h-6 bg-card w-3/4 mt-6 rounded mx-auto" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted text-xl py-16">
          {search ? 'Ничего не найдено' : 'Пока нет издательств'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[34px]">
          {filtered.map(p => (
            <PublisherCard key={p.id} item={{
              id: p.id,
              name: p.name,
              logo: p.logo || '/placeholder-logo.png',
            }} />
          ))}
        </div>
      )}
    </div>
  );
}