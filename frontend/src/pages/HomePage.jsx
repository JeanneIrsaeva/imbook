import { useEffect, useState } from 'react';
import HomeSection from '@components/home/HomeSection';
import apiClient from '../api/client';
import { toast } from 'sonner';

export default function HomePage() {
  const [library, setLibrary] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [publishers, setPublishers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [cardsRes, booksRes, authorsRes, charsRes, publishersRes] = await Promise.all([
          apiClient.get('/cards', { params: { limit: 8 } }),
          apiClient.get('/books', { params: { limit: 8, only_global: true } }),
          apiClient.get('/authors', { params: { only_global: true } }),
          apiClient.get('/characters'),
          apiClient.get('/publishers', { params: { only_global: true } }),
        ]);

        setLibrary(cardsRes.data.map((c) => ({
          id: c.id,
          title: c.book.title,
          author: c.book.authors?.map((a) => a.last_name).join(', '),
          cover: c.cover || c.book.cover || '/placeholder-cover.png',
          status: c.status,
        })));

        setCatalog(booksRes.data.map((b) => ({
          id: b.id,
          title: b.title,
          author: b.authors?.map((a) => a.last_name).join(', '),
          cover: b.cover || '/placeholder-cover.png',
        })));

        setAuthors(authorsRes.data.map((a) => ({
          id: a.id,
          name: `${a.last_name} ${a.first_name}`,
          photo: a.photo || '/placeholder-avatar.png',
        })));

        setCharacters(charsRes.data.map((c) => ({
          id: c.id,
          name: c.name,
          book: c.book_id,
          photo: c.photo || '/placeholder-avatar.png',
          isAvailable: c.is_available,
        })));

        setPublishers(publishersRes.data.map((p) => ({
          id: p.id,
          name: p.name,
          logo: p.logo || '/placeholder-logo.png',
        })));
      } catch (err) {
        console.error(err);
        toast.error('Ошибка загрузки главной');
      }
    };
    load();
  }, []);

  return (
    <div className="flex flex-col">
      <HomeSection
        title="Моя Библиотека"
        items={library}
        cardType="book"
        detailsHref="/library"
        divider="shelf"
        cardsPerPage={4}
        showEmptyState={true}
        emptyStateText="У вас пока нет книг"
        emptyStateHint="Добавьте первую книгу"
        emptyStateHref="/library"
      />
      <HomeSection title="Каталог" items={catalog} cardType="book" detailsHref="/catalog" backgroundMode="full" divider="shelf" />
      <HomeSection title="Авторы" items={authors} cardType="author" detailsHref="/authors" backgroundMode="none" divider="line" />
      <HomeSection title="Персонажи" items={characters} cardType="character" detailsHref="/characters" backgroundMode="full" divider="line" />
      <HomeSection title="Издательства" items={publishers} cardType="publisher" detailsHref="/publishers" backgroundMode="none" divider="publisher-shelf" cardsPerPage={3} />
    </div>
  );
}