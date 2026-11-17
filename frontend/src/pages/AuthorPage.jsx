import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/client';
import BookCard from '../components/ui/BookCard';
import { toast } from 'sonner';

export default function AuthorPage() {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [a, b] = await Promise.all([
          apiClient.get(`/authors/${id}`),
          apiClient.get(`/authors/${id}/my-books`),
        ]);
        setAuthor(a.data);
        setBooks(b.data);
      } catch {
        toast.error('Автор не найден');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="p-20 text-center text-muted">Загрузка...</div>;
  if (!author) return <div className="p-20 text-center text-muted">Не найден</div>;

  return (
    <div className="max-w-[1700px] mx-auto py-8 md:py-12 px-4 md:px-10">
      <Link to="/authors" className="text-[16px] text-gold hover:underline">← Все авторы</Link>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 md:gap-16 mt-8 md:mt-12 items-start">
        <div className="w-full aspect-square bg-paper border border-book-border flex items-center justify-center overflow-hidden rounded-full">
          {author.photo
            ? <img src={author.photo} alt={author.last_name} className="w-full h-full object-cover" />
            : <span className="text-muted text-lg">Нет фото</span>}
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl md:text-[48px] text-ink leading-tight">
            {author.last_name} {author.first_name} {author.middle_name || ''}
          </h1>
          {author.biography && (
            <p className="text-[16px] md:text-[20px] text-body leading-relaxed whitespace-pre-line">
              {author.biography}
            </p>
          )}
        </div>
      </div>

      <h2 className="text-2xl md:text-[36px] text-ink mt-12 mb-6 md:mb-8">Книги автора в каталоге</h2>
      {books.length === 0 ? (
        <p className="text-muted text-lg">В каталоге нет книг этого автора.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[34px]">
          {books.map(b => (
            <BookCard
              key={b.id}
              item={{
                id: b.id,
                title: b.title,
                author: b.authors?.map(a => a.last_name).join(', ') || '—',
                cover: b.cover || '/placeholder-cover.png',  // <-- берём обложку из книги
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}