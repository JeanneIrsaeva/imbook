import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import BookHeader from '../components/book/BookHeader';
import BookTabs from '../components/book/BookTabs';
import ProgressCircle from '../components/book/ProgressCircle';
import StarRating from '../components/book/StarRating';
import SearchSelect from '../components/ui/SearchSelect';
import TrashIcon from '../assets/icons/trash.svg?react';
import ChevronDownIcon from '../assets/icons/chevron-down.svg?react';
import { toast } from 'sonner';

export default function BookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [card, setCard] = useState(null);
  const [book, setBook] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [notes, setNotes] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [authorsList, setAuthorsList] = useState([]);
  const [genresList, setGenresList] = useState([]);
  const [publishersList, setPublishersList] = useState([]);

  const [activeTab, setActiveTab] = useState('description');
  const [isEditing, setIsEditing] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false); // модалка прогресса
  const [progressForm, setProgressForm] = useState({ current_page: 0, date_started: '', date_finished: '' });

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [newNote, setNewNote] = useState('');
  const [newQuote, setNewQuote] = useState({ text: '', page: '' });

  const [form, setForm] = useState({
    title: '', description: '',
    total_pages: 100, current_page: 0, year: '', series: '', price: '',
    book_type: 'physical', rating: 0, publisher_id: '',
    author_ids: [], genre_ids: [], cover: ''
  });

  const [addForm, setAddForm] = useState({
    total_pages: '', current_page: 0, year: '', series: '', price: '',
    book_type: 'physical', publisher_id: '', cover: ''
  });

  const fetchData = async () => {
    try {
      try {
        const { data } = await apiClient.get(`/cards/${id}`);
        setCard(data);
        setBook(data.book);
        setForm({
          title: data.book.title || '',
          description: data.book.description || '',
          total_pages: data.total_pages, current_page: data.current_page,
          year: data.year || '', series: data.series || '',
          price: data.price || '', book_type: data.book_type || 'physical',
          rating: data.rating || 0, publisher_id: data.publisher?.id || '',
          author_ids: data.book.authors?.map(a => a.id) || [],
          genre_ids: data.book.genres?.map(g => g.id) || [],
          cover: data.cover || ''
        });

        const [n, q, a, g, p] = await Promise.all([
          apiClient.get(`/cards/${id}/notes`),
          apiClient.get(`/cards/${id}/quotes`),
          apiClient.get('/authors'),
          apiClient.get('/genres'),
          apiClient.get('/publishers'),
        ]);
        setNotes(n.data); setQuotes(q.data);
        setAuthorsList(a.data); setGenresList(g.data); setPublishersList(p.data);
        return;
      } catch (e) {
        if (e.response && e.response.status === 404) {
          const { data } = await apiClient.get(`/books/${id}`);
          setBook(data);
          const [p, n, q] = await Promise.all([
            apiClient.get('/publishers'),
            apiClient.get(`/books/${data.id}/notes`),
            apiClient.get(`/books/${data.id}/quotes`),
          ]);
          setPublishersList(p.data);
          setNotes(n.data);
          setQuotes(q.data);
          return;
        }
        throw e;
      }
    } catch (err) {
      console.error('[BookPage]', err);
      toast.error('Книга не найдена');
      navigate('/library');
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  useEffect(() => {
    if (card?.status === 'finished' && book) {
      apiClient.get('/characters', { params: { book_id: book.id } })
        .then(res => setCharacters(res.data))
        .catch(() => {});
    }
  }, [card?.status, book?.id]);

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await apiClient.post('/uploads/cover', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (isAddOpen) setAddForm(prev => ({ ...prev, cover: data.url }));
      else setForm(prev => ({ ...prev, cover: data.url }));
      toast.success('Обложка загружена');
    } catch {
      toast.error('Ошибка загрузки');
    } finally {
      setUploading(false);
    }
  };

  const handleAddToLibrary = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const totalPages = Number(addForm.total_pages);
      if (!totalPages || totalPages < 1) {
        toast.error('Укажите количество страниц (минимум 1)');
        setSubmitting(false);
        return;
      }

      const payload = {
        book_id: book.id,
        total_pages: totalPages,
        current_page: Number(addForm.current_page) || 0,
        status: 'planned',
        publisher_id: addForm.publisher_id ? Number(addForm.publisher_id) : null,
        year: addForm.year ? Number(addForm.year) : null,
        series: addForm.series || null,
        price: addForm.price ? Number(addForm.price) : null,
        book_type: addForm.book_type || null,
        cover: addForm.cover || null,
      };

      const { data } = await apiClient.post(`/cards/from-catalog/${book.id}`, payload);
      toast.success('Добавлено в библиотеку');
      setIsAddOpen(false);
      navigate(`/book/${data.id}`, { replace: true });
    } catch (err) {
      console.error('[add-to-library]', err);
      toast.error(err.response?.data?.detail || 'Ошибка добавления');
    } finally {
      setSubmitting(false);
    }
  };
  const handleUpdateCard = async (e) => {
    e.preventDefault();
    try {
      const isOwnBook = card?.book?.owner_id === card?.user_id;

      const payload = {
        total_pages: Number(form.total_pages),
        current_page: Number(form.current_page),
        year: form.year ? Number(form.year) : null,
        series: form.series || null,
        price: form.price ? Number(form.price) : null,
        book_type: form.book_type,
        rating: Number(form.rating) || null,
        publisher_id: form.publisher_id ? Number(form.publisher_id) : null,
        cover: form.cover || null,
      };

      // Поля книги — только если книга личная
      if (isOwnBook) {
        payload.title = form.title;
        payload.description = form.description || null;
        payload.author_ids = form.author_ids;
        payload.genre_ids = form.genre_ids;
      } else {
        // Для книги каталога запрещаем менять авторов/жанры (тоже 403 на бэке)
        // ничего не отправляем
      }

      await apiClient.patch(`/cards/${card.id}`, payload);
      toast.success('Обновлено');
      setIsEditing(false);
      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Ошибка');
    }
  };

  // === КЛИК НА КНОПКУ СТАТУСА ===
  const handleStatusClick = () => {
    if (!card) return;
    // Открываем модалку прогресса с текущими значениями
    setProgressForm({
      current_page: card.current_page,
      date_started: card.date_started || '',
      date_finished: card.date_finished || '',
    });
    setIsProgressOpen(true);
  };

  // === ОБНОВИТЬ ПРОГРЕСС ===
  const handleUpdateProgress = async (e) => {
    e.preventDefault();
    try {
      await apiClient.patch(`/cards/${card.id}/progress`, {
        current_page: Number(progressForm.current_page),
        date_started: progressForm.date_started || null,
        date_finished: progressForm.date_finished || null,
      });
      toast.success('Прогресс обновлён');
      setIsProgressOpen(false);
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Ошибка');
    }
  };

  // === БЫСТРАЯ СМЕНА СТАТУСА ===
  const handleChangeStatus = async (newStatus) => {
    try {
      await apiClient.patch(`/cards/${card.id}/status`, null, { params: { new_status: newStatus } });
      toast.success('Статус обновлён');
      setIsProgressOpen(false);
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Ошибка');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Удалить?')) return;
    try {
      await apiClient.delete(`/cards/${card.id}`);
      navigate('/library');
    } catch { toast.error('Ошибка'); }
  };

  const handleStartChat = async (charId) => {
    try {
      await apiClient.post('/chat/dialogs', { character_id: charId });
      navigate('/chat');
    } catch { toast.error('Ошибка'); }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      await apiClient.post(`/cards/${card.id}/notes`, { text: newNote });
      setNewNote('');
      const { data } = await apiClient.get(`/cards/${card.id}/notes`);
      setNotes(data);
      toast.success('Заметка добавлена');
    } catch { toast.error('Ошибка'); }
  };

  const handleAddQuote = async () => {
    if (!newQuote.text.trim()) return;
    try {
      await apiClient.post(`/cards/${card.id}/quotes`, {
        text: newQuote.text,
        page_number: newQuote.page ? Number(newQuote.page) : null,
      });
      setNewQuote({ text: '', page: '' });
      const { data } = await apiClient.get(`/cards/${card.id}/quotes`);
      setQuotes(data);
      toast.success('Цитата добавлена');
    } catch { toast.error('Ошибка'); }
  };

  if (!book) return <div className="p-20 text-center text-muted">Загрузка...</div>;

  const isCatalogView = !card;
  const bookAuthors = book.authors || [];
  const bookGenres = book.genres || [];

  return (
    <div className="max-w-[1700px] mx-auto py-8 md:py-12 px-4 md:px-10">
      <BookHeader />
      <div className="grid grid-cols-1 lg:grid-cols-[519px_1fr] gap-8 md:gap-16 mt-8 md:mt-12">
        <div className="flex flex-col items-center gap-8 md:gap-12">
          <div className="w-full max-w-[519px] aspect-[519/708] bg-cover-placeholder border border-book-border flex items-center justify-center">
            <img
              src={
                (isEditing && form.cover)
                  ? form.cover
                  : (card?.cover || book?.cover || '/placeholder-cover.png')
              }
              alt={book.title}
              className="max-w-[85%] max-h-[85%] object-contain shadow-2xl"
            />
          </div>

          {isEditing && (
            <div className="w-full max-w-[413px]">
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleCoverUpload} className="hidden" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-[45px] border-2 border-border-medium rounded-lg text-sm">
                {uploading ? 'Загрузка...' : 'Сменить обложку'}
              </button>
            </div>
          )}

          {isCatalogView ? (
            <button
              onClick={() => setIsAddOpen(true)}
              className="w-full max-w-[413px] h-[61px] bg-gold text-white text-[16px] tracking-[1.6px] uppercase hover:bg-gold-hover rounded-lg"
            >
              Добавить в свою библиотеку
            </button>
          ) : (
            <div className="flex items-center justify-between w-full max-w-[413px]">
              <button onClick={handleDelete} className="w-[50px] h-[50px] flex items-center justify-center text-muted hover:text-red-600">
                <TrashIcon className="w-8 h-8" />
              </button>
              <button onClick={handleStatusClick} className="w-[150px] h-[50px] border-2 border-border-dark flex items-center justify-center gap-2 text-[14px] tracking-[1.6px] uppercase text-ink hover:border-gold">
                <span>{card.status === 'reading' ? 'Читаю' : card.status === 'finished' ? 'Прочитано' : 'В планах'}</span>
                <ChevronDownIcon className="w-3 h-3" />
              </button>
              <ProgressCircle value={card.progress_percent} size={50} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 md:gap-8 min-w-0">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-[48px] text-ink leading-tight break-words">{book.title}</h1>
            {!isCatalogView && (
              <button onClick={() => setIsEditing(!isEditing)} className="text-gold hover:underline text-sm">
                {isEditing ? 'Отмена' : 'Ред.'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[20px] md:text-[24px] text-gold font-medium">{card?.rating || 0}</span>
            <StarRating value={card?.rating || 0} size={20} />
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateCard} className="bg-card p-6 rounded-xl border border-border-light flex flex-col gap-4">
              {card?.book?.owner_id === card?.user_id && (
                <>
                  <label className="flex flex-col gap-1 text-sm text-muted">Название книги
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      className="h-[45px] px-3 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm text-muted">Описание
                    <textarea
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      placeholder="Описание книги..."
                      className="min-h-[100px] p-3 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold"
                    />
                  </label>
                </>
              )}
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1 text-sm text-muted">Всего страниц
                  <input type="number" value={form.total_pages} onChange={e => setForm({...form, total_pages: e.target.value})} className="h-[45px] px-3 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold" />
                </label>
                <label className="flex flex-col gap-1 text-sm text-muted">Текущая страница
                  <input type="number" value={form.current_page} onChange={e => setForm({...form, current_page: e.target.value})} className="h-[45px] px-3 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold" />
                </label>
                <label className="flex flex-col gap-1 text-sm text-muted">Год
                  <input type="number" value={form.year} onChange={e => setForm({...form, year: e.target.value})} className="h-[45px] px-3 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold" />
                </label>
                <label className="flex flex-col gap-1 text-sm text-muted">Цена
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="h-[45px] px-3 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold" />
                </label>
                <label className="flex flex-col gap-1 text-sm text-muted">Оценка (1-5)
                  <input type="number" min="1" max="5" value={form.rating} onChange={e => setForm({...form, rating: e.target.value})} className="h-[45px] px-3 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold" />
                </label>
                <label className="flex flex-col gap-1 text-sm text-muted">Тип
                  <select value={form.book_type} onChange={e => setForm({...form, book_type: e.target.value})} className="h-[45px] px-3 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold">
                    <option value="physical">Бумажная</option>
                    <option value="electronic">Электронная</option>
                  </select>
                </label>
              </div>

              <SearchSelect
                label="Издательство"
                value={form.publisher_id ? [Number(form.publisher_id)] : []}
                options={publishersList.map(p => ({ id: p.id, label: p.name }))}
                onChange={(ids) => setForm(prev => ({ ...prev, publisher_id: ids[0] || '' }))}
                allowCreate={true}
                onCreate={async (name) => {
                  const { data } = await apiClient.post('/publishers', { name });
                  setPublishersList(prev => [...prev, data]);
                  return { id: data.id, label: data.name };
                }}
                placeholder="Выберите или введите издательство..."
                multiple={false}
              />

              <SearchSelect
                label="Авторы"
                value={form.author_ids}
                options={authorsList.map(a => ({ id: a.id, label: `${a.last_name} ${a.first_name}` }))}
                onChange={(ids) => setForm(prev => ({ ...prev, author_ids: ids }))}
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
                value={form.genre_ids}
                options={genresList.map(g => ({ id: g.id, label: g.name }))}
                onChange={(ids) => setForm(prev => ({ ...prev, genre_ids: ids }))}
                allowCreate={true}
                onCreate={async (name) => {
                  const { data } = await apiClient.post('/genres', { name });
                  setGenresList(prev => [...prev, data]);
                  return { id: data.id, label: data.name };
                }}
                placeholder="Введите жанр..."
              />

              <button type="submit" className="h-[45px] bg-gold text-white rounded-lg uppercase">Сохранить</button>
            </form>
          ) : (
            <div className="flex flex-col gap-3 bg-card p-6 rounded-xl border border-border-light">
              <div className="grid grid-cols-[auto_1fr] gap-4 text-[16px]">
                <span className="text-muted">Автор:</span>
                <span className="text-ink">
                  {bookAuthors.length > 0
                    ? bookAuthors.map(a => `${a.last_name} ${a.first_name}`.trim()).join(', ')
                    : '—'}
                </span>
                <span className="text-muted">Жанр:</span>
                <span className="text-ink">
                  {bookGenres.length > 0
                    ? bookGenres.map(g => g.name).join(', ')
                    : '—'}
                </span>
                {card && (
                  <>
                    <span className="text-muted">Страниц:</span> <span className="text-ink">{card.total_pages}</span>
                    <span className="text-muted">Текущая:</span> <span className="text-ink">{card.current_page}</span>
                    {card.year && <><span className="text-muted">Год:</span> <span className="text-ink">{card.year}</span></>}
                    {card.publisher && <><span className="text-muted">Издательство:</span> <span className="text-ink">{card.publisher.name}</span></>}
                  </>
                )}
              </div>
            </div>
          )}

          <div className="mt-4">
            <BookTabs activeTab={activeTab} onChange={setActiveTab} />
          </div>

          <div className="bg-card border border-border-medium p-4 md:p-8 min-h-[200px]">
            {activeTab === 'description' && <p className="text-[16px] md:text-[20px] leading-relaxed text-ink">{book.description || 'Нет описания'}</p>}

            {activeTab === 'notes' && (
              <div className="flex flex-col gap-4">
                {!isCatalogView && (
                  <div className="flex gap-2">
                    <input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Новая заметка..." className="flex-1 h-[45px] px-4 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold" />
                    <button onClick={handleAddNote} className="h-[45px] px-6 bg-gold text-white rounded-lg uppercase text-sm">Добавить</button>
                  </div>
                )}
                {notes.length === 0 ? <p className="text-muted">Заметок пока нет.</p> : notes.map(n => (
                  <div key={n.id} className="p-3 bg-paper rounded-lg border border-border-light">
                    <p className="text-ink">{n.text}</p>
                    <p className="text-muted text-xs mt-1">{new Date(n.created_at).toLocaleDateString('ru-RU')}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'quotes' && (
              <div className="flex flex-col gap-4">
                {!isCatalogView && (
                  <div className="flex flex-col md:flex-row gap-2">
                    <input value={newQuote.text} onChange={e => setNewQuote({ ...newQuote, text: e.target.value })} placeholder="Текст цитаты..." className="flex-1 h-[45px] px-4 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold" />
                    <input type="number" value={newQuote.page} onChange={e => setNewQuote({ ...newQuote, page: e.target.value })} placeholder="Стр." className="w-full md:w-[100px] h-[45px] px-4 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold" />
                    <button onClick={handleAddQuote} className="h-[45px] px-6 bg-gold text-white rounded-lg uppercase text-sm">Добавить</button>
                  </div>
                )}
                {quotes.length === 0 ? <p className="text-muted">Цитат пока нет.</p> : quotes.map(q => (
                  <div key={q.id} className="p-3 bg-paper rounded-lg border border-border-light border-l-4 border-l-gold">
                    <p className="text-ink italic">«{q.text}»</p>
                    {q.page_number && <p className="text-muted text-xs mt-1">— стр. {q.page_number}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {card?.status === 'finished' && (
        <div className="mt-16 bg-card border border-border-medium p-6 rounded-2xl">
          <h2 className="text-2xl font-serif text-ink mb-4">Персонажи</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters.map((char) => (
              <div key={char.id} className="p-4 bg-paper rounded-xl border border-border-light flex items-center gap-4">
                <img src={char.photo || '/placeholder-avatar.png'} alt={char.name} className="w-16 h-16 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink truncate">{char.name}</p>
                  <button onClick={() => handleStartChat(char.id)} className="mt-2 text-sm text-gold hover:underline">Начать диалог →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* МОДАЛКА "ДОБАВИТЬ ИЗ КАТАЛОГА" */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => !submitting && setIsAddOpen(false)} />
          <div className="relative bg-paper border border-border-medium rounded-2xl p-6 w-full max-w-[520px] my-8">
            <h2 className="text-2xl font-serif text-ink mb-4">Добавить в библиотеку</h2>
            <form onSubmit={handleAddToLibrary} className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-28 bg-border-light rounded-md overflow-hidden flex items-center justify-center shrink-0">
                  {addForm.cover
                    ? <img src={addForm.cover} alt="Обложка" className="w-full h-full object-cover" />
                    : <span className="text-muted text-[10px] text-center px-1">Нет обложки</span>}
                </div>
                <div>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleCoverUpload} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-paper-dark border border-border-medium rounded-lg text-sm">
                    {uploading ? 'Загрузка...' : 'Загрузить обложку'}
                  </button>
                </div>
              </div>

              <label className="flex flex-col gap-1 text-sm text-muted">Количество страниц
                <input
                  type="number"
                  min="1"
                  required
                  value={addForm.total_pages}
                  onChange={e => setAddForm({ ...addForm, total_pages: e.target.value })}
                  className="h-[45px] px-3 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1 text-sm text-muted">Год
                  <input type="number" value={addForm.year} onChange={e => setAddForm({ ...addForm, year: e.target.value })} className="h-[45px] px-3 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold" />
                </label>
                <label className="flex flex-col gap-1 text-sm text-muted">Цена
                  <input type="number" value={addForm.price} onChange={e => setAddForm({ ...addForm, price: e.target.value })} className="h-[45px] px-3 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold" />
                </label>
              </div>

              <label className="flex flex-col gap-1 text-sm text-muted">Тип
                <select value={addForm.book_type} onChange={e => setAddForm({ ...addForm, book_type: e.target.value })} className="h-[45px] px-3 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold">
                  <option value="physical">Бумажная</option>
                  <option value="electronic">Электронная</option>
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm text-muted">Издательство
                <select value={addForm.publisher_id} onChange={e => setAddForm({ ...addForm, publisher_id: e.target.value })} className="h-[45px] px-3 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold">
                  <option value="">Не указано</option>
                  {publishersList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </label>

              <div className="flex gap-4 mt-2">
                <button type="button" onClick={() => setIsAddOpen(false)} disabled={submitting} className="flex-1 h-[50px] border-2 border-border-dark rounded-lg uppercase hover:bg-card disabled:opacity-60">
                  Отмена
                </button>
                <button type="submit" disabled={submitting} className="flex-1 h-[50px] bg-gold text-white rounded-lg uppercase hover:bg-gold-hover disabled:opacity-60">
                  {submitting ? 'Добавляем...' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* МОДАЛКА ПРОГРЕССА */}
      {isProgressOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setIsProgressOpen(false)} />
          <div className="relative bg-paper border border-border-medium rounded-2xl p-6 w-full max-w-[480px]">
            <h2 className="text-2xl font-serif text-ink mb-4">Обновить прогресс</h2>

            <form onSubmit={handleUpdateProgress} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1 text-sm text-muted">
                Текущая страница (из {card.total_pages})
                <input
                  type="number"
                  min="0"
                  max={card.total_pages}
                  value={progressForm.current_page}
                  onChange={e => setProgressForm({ ...progressForm, current_page: e.target.value })}
                  className="h-[45px] px-3 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold"
                  required
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1 text-sm text-muted">Дата начала
                  <input
                    type="date"
                    value={progressForm.date_started}
                    onChange={e => setProgressForm({ ...progressForm, date_started: e.target.value })}
                    className="h-[45px] px-3 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm text-muted">Дата окончания
                  <input
                    type="date"
                    value={progressForm.date_finished}
                    onChange={e => setProgressForm({ ...progressForm, date_finished: e.target.value })}
                    className="h-[45px] px-3 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold"
                  />
                </label>
              </div>

              <button type="submit" className="h-[50px] bg-gold text-white rounded-lg uppercase hover:bg-gold-hover">
                Сохранить прогресс
              </button>
            </form>

            <div className="mt-4 border-t border-border-light pt-4">
              <p className="text-sm text-muted mb-2">Или быстро сменить статус:</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleChangeStatus('planned')} className={`px-3 py-2 rounded-lg text-sm border ${card.status === 'planned' ? 'border-gold text-gold' : 'border-border-medium text-ink'}`}>В планах</button>
                <button onClick={() => handleChangeStatus('reading')} className={`px-3 py-2 rounded-lg text-sm border ${card.status === 'reading' ? 'border-gold text-gold' : 'border-border-medium text-ink'}`}>Читаю</button>
                <button onClick={() => handleChangeStatus('finished')} className={`px-3 py-2 rounded-lg text-sm border ${card.status === 'finished' ? 'border-gold text-gold' : 'border-border-medium text-ink'}`}>Прочитано</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}