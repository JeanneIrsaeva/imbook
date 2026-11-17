import { useEffect, useState, useRef } from 'react';
import apiClient from '../../api/client';
import SearchSelect from '../ui/SearchSelect';
import { toast } from 'sonner';

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', cover: '', author_ids: [], genre_ids: [] });
  const [coverPreview, setCoverPreview] = useState('');
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [activeContentBook, setActiveContentBook] = useState(null);
  const [notes, setNotes] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [newQuote, setNewQuote] = useState({ text: '', page: '' });
  const [loadingContent, setLoadingContent] = useState(false);

  const load = async () => {
    const [b, a, g] = await Promise.all([
      apiClient.get('/books', { params: { only_global: true } }),
      apiClient.get('/authors', { params: { only_global: true } }),
      apiClient.get('/genres', { params: { only_global: true } }),
    ]);
    setBooks(b.data); setAuthors(a.data); setGenres(g.data);
  };

  useEffect(() => { load(); }, []);

  const loadContent = async (bookId) => {
    setLoadingContent(true);
    try {
      const [n, q] = await Promise.all([
        apiClient.get(`/books/${bookId}/notes`),
        apiClient.get(`/books/${bookId}/quotes`),
      ]);
      setNotes(n.data);
      setQuotes(q.data);
    } catch {
      toast.error('Не удалось загрузить заметки/цитаты');
    } finally {
      setLoadingContent(false);
    }
  };

  const openContent = (book) => {
    setActiveContentBook(book);
    setNewNote('');
    setNewQuote({ text: '', page: '' });
    loadContent(book.id);
  };

  const closeContent = () => {
    setActiveContentBook(null);
    setNotes([]);
    setQuotes([]);
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      await apiClient.post(`/books/${activeContentBook.id}/notes`, { text: newNote });
      setNewNote('');
      loadContent(activeContentBook.id);
      toast.success('Заметка добавлена');
    } catch { toast.error('Ошибка'); }
  };

  const handleAddQuote = async () => {
    if (!newQuote.text.trim()) return;
    try {
      await apiClient.post(`/books/${activeContentBook.id}/quotes`, {
        text: newQuote.text,
        page_number: newQuote.page ? Number(newQuote.page) : null,
      });
      setNewQuote({ text: '', page: '' });
      loadContent(activeContentBook.id);
      toast.success('Цитата добавлена');
    } catch { toast.error('Ошибка'); }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Удалить заметку?')) return;
    try {
      await apiClient.delete(`/books/${activeContentBook.id}/notes/${noteId}`);
      loadContent(activeContentBook.id);
    } catch { toast.error('Ошибка'); }
  };

  const handleDeleteQuote = async (quoteId) => {
    if (!confirm('Удалить цитату?')) return;
    try {
      await apiClient.delete(`/books/${activeContentBook.id}/quotes/${quoteId}`);
      loadContent(activeContentBook.id);
    } catch { toast.error('Ошибка'); }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await apiClient.post('/uploads/cover', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setCoverPreview(data.url);
      setForm(prev => ({ ...prev, cover: data.url }));
      toast.success('Обложка загружена');
    } catch {
      toast.error('Ошибка загрузки');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await apiClient.patch(`/books/${editId}`, form);
        toast.success('Обновлено');
      } else {
        await apiClient.post('/books', form);
        toast.success('Добавлено');
      }
      setForm({ title: '', description: '', cover: '', author_ids: [], genre_ids: [] });
      setCoverPreview('');
      setEditId(null);
      load();
    } catch {
      toast.error('Ошибка');
    }
  };

  const handleEdit = (b) => {
    setForm({
      title: b.title,
      description: b.description || '',
      cover: b.cover || '',
      author_ids: b.authors.map(a => a.id),
      genre_ids: b.genres.map(g => g.id),
    });
    setCoverPreview(b.cover || '');
    setEditId(b.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить?')) return;
    try { await apiClient.delete(`/books/${id}`); load(); } catch { toast.error('Нельзя удалить'); }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-card border border-border-medium rounded-2xl p-6 md:p-8">
        <h2 className="text-2xl text-ink mb-6">{editId ? 'Редактировать книгу' : 'Добавить книгу в каталог'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8 bg-paper p-4 rounded-xl border border-border-light">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Название"
            className="h-[50px] px-4 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold"
            required
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Описание"
            className="min-h-[80px] p-4 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold"
          />

          <div className="flex gap-4 items-center">
            {coverPreview && (
              <img src={coverPreview} alt="" className="w-16 h-20 object-cover rounded border border-border-light" />
            )}
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleCoverUpload} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="h-[40px] px-4 bg-paper-dark border border-border-medium rounded-lg text-sm">
              {uploading ? '...' : 'Загрузить обложку'}
            </button>
          </div>

          <SearchSelect
            label="Авторы"
            value={form.author_ids}
            options={authors.map(a => ({ id: a.id, label: `${a.last_name} ${a.first_name}` }))}
            onChange={(ids) => setForm({ ...form, author_ids: ids })}
            allowCreate={true}
            onCreate={async (name) => {
              const parts = name.split(' ');
              const { data } = await apiClient.post('/authors', {
                last_name: parts[0] || 'Без фамилии',
                first_name: parts[1] || 'Без имени',
              });
              setAuthors(prev => [...prev, data]);
              return { id: data.id, label: `${data.last_name} ${data.first_name}` };
            }}
            placeholder="Введите имя автора..."
          />

          <SearchSelect
            label="Жанры"
            value={form.genre_ids}
            options={genres.map(g => ({ id: g.id, label: g.name }))}
            onChange={(ids) => setForm({ ...form, genre_ids: ids })}
            allowCreate={true}
            onCreate={async (name) => {
              const { data } = await apiClient.post('/genres', { name });
              setGenres(prev => [...prev, data]);
              return { id: data.id, label: data.name };
            }}
            placeholder="Введите жанр..."
          />

          <div className="flex gap-4">
            <button type="submit" className="h-[50px] px-8 bg-gold text-white rounded-lg uppercase">
              {editId ? 'Сохранить' : 'Добавить'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm({ title: '', description: '', cover: '', author_ids: [], genre_ids: [] });
                  setCoverPreview('');
                }}
                className="h-[50px] px-8 border-2 border-border-dark rounded-lg uppercase"
              >
                Отмена
              </button>
            )}
          </div>
        </form>

        <div className="flex flex-col gap-2">
          {books.map(b => (
            <div key={b.id} className="flex justify-between items-center p-3 bg-paper rounded-lg border border-border-light">
              <div className="flex items-center gap-3">
                {b.cover ? (
                  <img src={b.cover} alt="" className="w-8 h-11 object-cover rounded" />
                ) : (
                  <div className="w-8 h-11 bg-border-light rounded" />
                )}
                <span className="font-medium text-ink">{b.title}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openContent(b)} className="text-ink hover:text-gold text-sm">Заметки/Цитаты</button>
                <button onClick={() => handleEdit(b)} className="text-gold text-sm">Ред.</button>
                <button onClick={() => handleDelete(b.id)} className="text-red-500 text-sm">Удалить</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeContentBook && (
        <div className="bg-card border border-border-medium rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-ink">
              Заметки и цитаты: <span className="text-gold">«{activeContentBook.title}»</span>
            </h2>
            <button onClick={closeContent} className="text-muted hover:text-ink text-sm">× Закрыть</button>
          </div>

          {loadingContent ? (
            <p className="text-muted">Загрузка...</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-paper border border-border-light rounded-xl p-4">
                <h3 className="text-lg font-serif text-ink mb-3">Заметки</h3>
                <div className="flex gap-2 mb-4">
                  <input
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder="Новая заметка..."
                    className="flex-1 h-[45px] px-4 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold"
                  />
                  <button onClick={handleAddNote} className="h-[45px] px-4 bg-gold text-white rounded-lg uppercase text-sm">
                    Добавить
                  </button>
                </div>
                {notes.length === 0 ? (
                  <p className="text-muted text-sm">Заметок нет.</p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                    {notes.map(n => (
                      <div key={n.id} className="p-3 bg-paper-dark rounded-lg border border-border-light flex justify-between gap-2">
                        <p className="text-ink text-sm">{n.text}</p>
                        <button onClick={() => handleDeleteNote(n.id)} className="text-red-500 text-xs shrink-0">Удалить</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-paper border border-border-light rounded-xl p-4">
                <h3 className="text-lg font-serif text-ink mb-3">Цитаты</h3>
                <div className="flex gap-2 mb-4">
                  <input
                    value={newQuote.text}
                    onChange={e => setNewQuote({ ...newQuote, text: e.target.value })}
                    placeholder="Текст цитаты..."
                    className="flex-1 h-[45px] px-4 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold"
                  />
                  <input
                    type="number"
                    value={newQuote.page}
                    onChange={e => setNewQuote({ ...newQuote, page: e.target.value })}
                    placeholder="Стр."
                    className="w-[80px] h-[45px] px-4 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold"
                  />
                  <button onClick={handleAddQuote} className="h-[45px] px-4 bg-gold text-white rounded-lg uppercase text-sm">
                    Добавить
                  </button>
                </div>
                {quotes.length === 0 ? (
                  <p className="text-muted text-sm">Цитат нет.</p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                    {quotes.map(q => (
                      <div key={q.id} className="p-3 bg-paper-dark rounded-lg border border-border-light border-l-4 border-l-gold flex justify-between gap-2">
                        <div>
                          <p className="text-ink italic text-sm">«{q.text}»</p>
                          {q.page_number && <p className="text-muted text-xs mt-1">— стр. {q.page_number}</p>}
                        </div>
                        <button onClick={() => handleDeleteQuote(q.id)} className="text-red-500 text-xs shrink-0">Удалить</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}