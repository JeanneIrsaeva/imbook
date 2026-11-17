import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../api/client';
import BookCard from '../components/ui/BookCard';
import { toast } from 'sonner';

export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || '';
  const authorFilter = searchParams.get('author') || '';
  const genreFilter = searchParams.get('genre') || '';
  const yearFilter = searchParams.get('year') || '';

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get('/books', { params: { search, only_global: true } });
        setBooks(data);
      } catch {
        toast.error('Не удалось загрузить каталог');
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const processed = useMemo(() => {
    let list = [...books];

    if (authorFilter) {
      list = list.filter(b =>
        (b.authors || []).some(a => String(a.id) === String(authorFilter))
      );
    }
    if (genreFilter) {
      list = list.filter(b =>
        (b.genres || []).some(g => g.name === genreFilter)
      );
    }
    if (yearFilter) {
      // В Book нет year — фильтр по году работает только если у книги есть поле year.
      // Пока оставим как задел: пропускаем фильтр, если нет поля.
    }

    switch (sort) {
      case 'title_asc':
        list.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
        break;
      case 'title_desc':
        list.sort((a, b) => b.title.localeCompare(a.title, 'ru'));
        break;
      case 'year_desc':
      case 'year_asc':
        // в Book нет year — пропускаем
        break;
      default:
        break;
    }

    return list;
  }, [books, authorFilter, genreFilter, yearFilter, sort]);

  return (
    <div className="max-w-[1700px] mx-auto py-8 md:py-12 px-4 md:px-10">
      <header className="flex flex-col items-center gap-2 mb-8 md:mb-12">
        <p className="text-[13px] tracking-[1.56px] text-muted uppercase text-center">Все книги в системе</p>
        <div className="flex items-center justify-center gap-4 md:gap-[61px] w-full mt-6">
          <span className="h-px flex-1 md:w-[459px] bg-border-light" />
          <h1 className="text-3xl md:text-[48px] text-ink text-center leading-none whitespace-nowrap">
            Каталог{search && ` — «${search}»`}
          </h1>
          <span className="h-px flex-1 md:w-[459px] bg-border-light" />
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[34px]">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-full max-w-[326px] mx-auto animate-pulse flex flex-col items-center">
              <div className="w-full aspect-[326/437] bg-card border border-book-border" />
              <div className="h-6 bg-card w-3/4 mt-4 rounded" />
            </div>
          ))}
        </div>
      ) : processed.length === 0 ? (
        <div className="text-center text-muted text-xl py-16">
          {search || authorFilter || genreFilter ? 'Ничего не найдено' : 'Каталог пуст'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[34px]">
          {processed.map(book => (
            <BookCard
              key={book.id}
              onClick={(id) => navigate(`/book/${id}`)}
              item={{
                id: book.id,
                title: book.title,
                author: book.authors?.map(a => a.last_name).join(', ') || '—',
                cover: book.cover || '/placeholder-cover.png',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}