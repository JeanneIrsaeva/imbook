import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/client';
import BookCard from '../components/ui/BookCard';
import { toast } from 'sonner';

export default function PublisherPage() {
  const { id } = useParams();
  const [publisher, setPublisher] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, c] = await Promise.all([
          apiClient.get(`/publishers/${id}`),
          apiClient.get(`/publishers/${id}/my-books`),
        ]);
        setPublisher(p.data);
        setCards(c.data);
      } catch {
        toast.error('Издательство не найдено');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="p-20 text-center text-muted">Загрузка...</div>;
  if (!publisher) return <div className="p-20 text-center text-muted">Не найдено</div>;

  return (
    <div className="max-w-[1700px] mx-auto py-8 md:py-12 px-4 md:px-10">
      <Link to="/publishers" className="text-[16px] text-gold hover:underline">← Все издательства</Link>

      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mt-8 md:mt-12">
        <div className="w-full max-w-[300px] aspect-[438/328] bg-paper border border-book-border flex items-center justify-center overflow-hidden">
          {publisher.logo
            ? <img src={publisher.logo} alt={publisher.name} className="max-w-[80%] max-h-[80%] object-contain" />
            : <span className="text-muted text-lg">Нет логотипа</span>}
        </div>
        <h1 className="text-3xl md:text-[48px] text-ink leading-tight">{publisher.name}</h1>
      </div>

      <h2 className="text-2xl md:text-[36px] text-ink mt-12 mb-6 md:mb-8">Книги в вашей библиотеке</h2>
      {cards.length === 0 ? (
        <p className="text-muted text-lg">У вас нет книг этого издательства.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[34px]">
          {cards.map(c => (
            <BookCard
              key={c.id}
              item={{
                id: c.id,
                title: c.book.title,
                author: c.book.authors?.map(a => a.last_name).join(', ') || '—',
                cover: c.cover || c.book.cover || '/placeholder-cover.png',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}