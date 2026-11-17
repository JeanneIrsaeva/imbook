import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import LibraryHeader from '@components/library/LibraryHeader';
import LibraryTabs from '@components/library/LibraryTabs';
import BookCard from '@components/ui/BookCard';
import Shelf from '@components/home/Shelf';
import EmptyState from '@components/library/EmptyState';
import SearchSelect from '@components/ui/SearchSelect';
import apiClient from '../api/client';
import { toast } from 'sonner';

const TAB_TO_STATUS = { all: null, planned: 'planned', reading: 'reading', read: 'finished' };
const CARDS_PER_ROW = 4;

export default function LibraryPage() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('q') || '';
  const statusFilter = searchParams.get('status') || '';
  const sort = searchParams.get('sort') || '';

  const [activeTab, setActiveTab] = useState('all');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [authorsList, setAuthorsList] = useState([]);
  const [genresList, setGenresList] = useState([]);
  const [publishersList, setPublishersList] = useState([]);

  const [form, setForm] = useState({
    title: '', description: '', total_pages: 100,
    selectedAuthors: [], selectedGenres: [], selectedPublisher: [],
  });

  const loadCards = async () => {
    setLoading(true);
    try {
      const params = TAB_TO_STATUS[activeTab] ? { status_filter: TAB_TO_STATUS[activeTab] } : {};
      const { data } = await apiClient.get('/cards', { params });
      setCards(data);
    } catch { toast.error('Ошибка загрузки'); } finally { setLoading(false); }
  };

  useEffect(() => { loadCards(); }, [activeTab]);

  const loadDictionaries = async () => {
    try {
      const [a, g, p] = await Promise.all([
        apiClient.get('/authors'),
        apiClient.get('/genres'),
        apiClient.get('/publishers'),
      ]);
      setAuthorsList(a.data); setGenresList(g.data); setPublishersList(p.data);
    } catch {}
  };

  const openModal = () => { loadDictionaries(); setIsModalOpen(true); };

  const handleCreateBook = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/cards/personal', {
        title: form.title,
        description: form.description || 'Личная книга',
        author_ids: form.selectedAuthors,
        genre_ids: form.selectedGenres,
        new_authors: [],
        new_genres: [],
        total_pages: form.total_pages,
        current_page: 0,
        status: 'planned',
        publisher_id: form.selectedPublisher[0] || null,
      });
      toast.success('Личная книга добавлена');
      setIsModalOpen(false);
      setForm({ title: '', description: '', total_pages: 100, selectedAuthors: [], selectedGenres: [], selectedPublisher: [] });
      loadCards();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Ошибка создания');
    }
  };

  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = cards
      .map(c => ({
        id: c.id,
        title: c.book.title,
        author: c.book.authors?.map(a => a.last_name).join(', '),
        cover: c.cover || c.book.cover || '/placeholder-cover.png',
        status: c.status,
        progress: c.progress_percent || 0,
      }))
      .filter(item => {
        if (!q) return true;
        return (
          item.title.toLowerCase().includes(q) ||
          (item.author || '').toLowerCase().includes(q)
        );
      });

    switch (sort) {
      case 'title_asc':
        list.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
        break;
      case 'title_desc':
        list.sort((a, b) => b.title.localeCompare(a.title, 'ru'));
        break;
      case 'progress_desc':
        list.sort((a, b) => b.progress - a.progress);
        break;
      case 'progress_asc':
        list.sort((a, b) => a.progress - b.progress);
        break;
      default:
        break;
    }

    return list;
  }, [cards, search, sort]);

  const rows = useMemo(() => {
    const res = [];
    for (let i = 0; i < items.length; i += CARDS_PER_ROW) res.push(items.slice(i, i + CARDS_PER_ROW));
    return res;
  }, [items]);

  return (
    <div className="max-w-[1700px] mx-auto py-8 md:py-12 px-4 md:px-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <LibraryHeader />
        <button onClick={openModal} className="self-center md:self-auto px-6 h-[48px] bg-gold text-white rounded-full text-[14px] tracking-[1.6px] uppercase hover:bg-gold-hover">
          + Своя книга
        </button>
      </div>

      <LibraryTabs activeTab={activeTab} onChange={setActiveTab} />

      {search && (
        <p className="text-center text-muted text-[15px] mb-6">
          Результаты по запросу: <span className="text-ink font-medium">«{search}»</span>
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[34px]">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-full max-w-[326px] mx-auto animate-pulse flex flex-col items-center">
              <div className="w-full aspect-[326/437] bg-card border border-book-border" />
              <div className="h-6 bg-card w-3/4 mt-4 rounded" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <div className="flex flex-col gap-8 md:gap-12">
          {rows.map((rowBooks, idx) => (
            <div key={idx}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[34px]">
                {rowBooks.map(book => <BookCard key={book.id} item={book} />)}
              </div>
              <div className="mt-6"><Shelf /></div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-paper border border-border-medium rounded-2xl p-6 w-full max-w-[600px] my-8">
            <h2 className="text-2xl font-serif text-ink mb-4">Создать книгу</h2>
            <form onSubmit={handleCreateBook} className="flex flex-col gap-4">
              <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Название книги" className="h-[50px] px-4 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold" />
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Описание" className="min-h-[80px] p-4 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold" />

              <input type="number" value={form.total_pages} onChange={e => setForm({ ...form, total_pages: Number(e.target.value) })} placeholder="Кол-во страниц" className="h-[50px] px-4 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold" required />

              <SearchSelect
                label="Авторы"
                value={form.selectedAuthors}
                options={authorsList.map(a => ({ id: a.id, label: `${a.last_name} ${a.first_name}` }))}
                onChange={(ids) => setForm(prev => ({ ...prev, selectedAuthors: ids }))}
                allowCreate={true}
                onCreate={async (name) => {
                  const parts = name.split(' ');
                  const { data } = await apiClient.post('/authors', {
                    last_name: parts[0] || 'Без фамилии',
                    first_name: parts[1] || 'Без имени',
                  });
                  setAuthorsList(prev => [...prev, data]);
                  return { id: data.id, label: `${data.last_name} ${data.first_name}` };
                }}
                placeholder="Введите имя автора..."
              />

              <SearchSelect
                label="Жанры"
                value={form.selectedGenres}
                options={genresList.map(g => ({ id: g.id, label: g.name }))}
                onChange={(ids) => setForm(prev => ({ ...prev, selectedGenres: ids }))}
                allowCreate={true}
                onCreate={async (name) => {
                  const { data } = await apiClient.post('/genres', { name });
                  setGenresList(prev => [...prev, data]);
                  return { id: data.id, label: data.name };
                }}
                placeholder="Введите жанр..."
              />

              <SearchSelect
                label="Издательство"
                value={form.selectedPublisher}
                options={publishersList.map(p => ({ id: p.id, label: p.name }))}
                onChange={(ids) => setForm(prev => ({ ...prev, selectedPublisher: ids.slice(-1) }))}
                allowCreate={true}
                onCreate={async (name) => {
                  const { data } = await apiClient.post('/publishers', { name });
                  setPublishersList(prev => [...prev, data]);
                  return { id: data.id, label: data.name };
                }}
                placeholder="Введите издательство..."
                multiple={false}
              />

              <div className="flex gap-4 mt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-[50px] border-2 border-border-dark rounded-lg uppercase hover:bg-card">Отмена</button>
                <button type="submit" className="flex-1 h-[50px] bg-gold text-white rounded-lg uppercase hover:bg-gold-hover">Создать</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}