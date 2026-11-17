import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { toast } from 'sonner';
import BookCard from '../components/ui/BookCard';
import AuthorCard from '../components/ui/AuthorCard';
import PublisherCard from '../components/ui/PublisherCard';
import CharacterCard from '../components/ui/CharacterCard';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get('q') || '').trim();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ books: [], authors: [], publishers: [], characters: [], myCards: [] });

  useEffect(() => {
    if (!q) { setLoading(false); return; }

    const load = async () => {
      setLoading(true);
      try {
        const lower = q.toLowerCase();
        const [b, a, p, c, mc] = await Promise.all([
          apiClient.get('/books', { params: { search: q, only_global: true } }),
          apiClient.get('/authors', { params: { only_global: true } }),
          apiClient.get('/publishers', { params: { only_global: true } }),
          apiClient.get('/characters'),
          apiClient.get('/cards'),
        ]);

        setData({
          books: b.data,
          authors: a.data.filter(x => `${x.last_name} ${x.first_name}`.toLowerCase().includes(lower)),
          publishers: p.data.filter(x => x.name.toLowerCase().includes(lower)),
          characters: c.data.filter(x => x.name.toLowerCase().includes(lower)),
          myCards: mc.data.filter(x =>
            x.book.title.toLowerCase().includes(lower) ||
            (x.book.authors || []).some(au => `${au.last_name} ${au.first_name}`.toLowerCase().includes(lower))
          ),
        });
      } catch {
        toast.error('Ошибка поиска');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [q]);

  const total = useMemo(
    () => data.books.length + data.authors.length + data.publishers.length + data.characters.length + data.myCards.length,
    [data]
  );

  if (!q) {
    return (
      <div className="max-w-[1700px] mx-auto py-20 px-4 text-center">
        <h1 className="text-3xl text-ink font-serif">Что будем искать?</h1>
        <p className="text-muted mt-2">Введите название книги, автора, издательство или персонажа в строку поиска сверху.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-[1700px] mx-auto py-20 px-4 text-center text-muted text-xl">
        Ищем «{q}»...
      </div>
    );
  }

  return (
    <div className="max-w-[1700px] mx-auto py-8 md:py-12 px-4 md:px-10">
      <header className="flex flex-col items-center gap-2 mb-8 md:mb-12">
        <p className="text-[13px] tracking-[1.56px] text-muted uppercase text-center">Результаты поиска</p>
        <div className="flex items-center justify-center gap-4 md:gap-[61px] w-full mt-6">
          <span className="h-px flex-1 md:w-[459px] bg-border-light" />
          <h1 className="text-2xl md:text-[40px] text-ink text-center leading-tight">
            По запросу «{q}»
          </h1>
          <span className="h-px flex-1 md:w-[459px] bg-border-light" />
        </div>
        <p className="text-muted text-[14px] mt-2">Всего найдено: {total}</p>
      </header>

      {total === 0 && (
        <p className="text-center text-muted text-xl py-16">Ничего не найдено</p>
      )}

      {data.myCards.length > 0 && (
        <Section title={`В моей библиотеке (${data.myCards.length})`} href="/library">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[34px]">
            {data.myCards.map(c => (
              <BookCard
                key={c.id}
                item={{
                  id: c.id,
                  title: c.book.title,
                  author: c.book.authors?.map(a => a.last_name).join(', ') || '—',
                  cover: c.cover || '/placeholder-cover.png',
                }}
              />
            ))}
          </div>
        </Section>
      )}

      {data.books.length > 0 && (
        <Section title={`Книги в каталоге (${data.books.length})`} href="/catalog">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[34px]">
            {data.books.map(b => (
              <BookCard
                key={b.id}
                item={{
                  id: b.id,
                  title: b.title,
                  author: b.authors?.map(a => a.last_name).join(', ') || '—',
                  cover: '/placeholder-cover.png',
                }}
              />
            ))}
          </div>
        </Section>
      )}

      {data.authors.length > 0 && (
        <Section title={`Авторы (${data.authors.length})`} href="/authors">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[34px]">
            {data.authors.map(a => (
              <AuthorCard key={a.id} item={{
                id: a.id,
                name: `${a.last_name} ${a.first_name}`,
                photo: a.photo || '/placeholder-avatar.png',
              }} />
            ))}
          </div>
        </Section>
      )}

      {data.publishers.length > 0 && (
        <Section title={`Издательства (${data.publishers.length})`} href="/publishers">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[34px]">
            {data.publishers.map(p => (
              <PublisherCard key={p.id} item={{
                id: p.id,
                name: p.name,
                logo: p.logo || '/placeholder-logo.png',
              }} />
            ))}
          </div>
        </Section>
      )}

      {data.characters.length > 0 && (
        <Section title={`Персонажи (${data.characters.length})`} href="/characters">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[34px]">
            {data.characters.map(c => (
              <CharacterCard key={c.id} item={{
                id: c.id,
                name: c.name,
                book: c.book_id,
                photo: c.photo || '/placeholder-avatar.png',
              }} />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function Section({ title, href, children }) {
  return (
    <div className="mb-14">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-[32px] font-serif text-ink">{title}</h2>
        <Link to={href} className="text-gold hover:underline text-sm">Смотреть все →</Link>
      </div>
      {children}
    </div>
  );
}