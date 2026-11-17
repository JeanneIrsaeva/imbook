import { useEffect, useState, useRef } from 'react';
import apiClient from '../../api/client';
import SearchSelect from '../ui/SearchSelect';
import { toast } from 'sonner';

export default function AdminCharacters() {
  const [items, setItems] = useState([]);
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', book_id: '', system_prompt: '', photo: '' });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const load = async () => {
    const [c, b] = await Promise.all([
      apiClient.get('/characters'),
      apiClient.get('/books', { params: { only_global: true } }),
    ]);
    setItems(c.data);
    setBooks(b.data);
  };

  useEffect(() => { load(); }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await apiClient.post('/uploads/character-photo', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm((prev) => ({ ...prev, photo: data.url }));
      toast.success('Фото загружено');
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
      await apiClient.post('/characters', { ...form, book_id: Number(form.book_id) });
      toast.success('Персонаж добавлен');
      setForm({ name: '', description: '', book_id: '', system_prompt: '', photo: '' });
      load();
    } catch {
      toast.error('Ошибка');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить?')) return;
    try {
      await apiClient.delete(`/characters/${id}`);
      toast.success('Удалено');
      load();
    } catch {
      toast.error('Ошибка удаления');
    }
  };

  return (
    <div className="bg-card border border-border-medium rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl text-ink mb-6">Управление персонажами</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-paper p-4 rounded-xl border border-border-light">
        <div className="col-span-full flex items-center gap-4 mb-2">
          <div className="w-20 h-20 bg-border-light rounded-full overflow-hidden flex items-center justify-center">
            {form.photo ? (
              <img src={form.photo} alt="Фото" className="w-full h-full object-cover" />
            ) : (
              <span className="text-muted text-xs">Нет фото</span>
            )}
          </div>
          <div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-paper-dark border border-border-medium rounded-lg text-sm hover:bg-border-light transition-colors">
              {uploading ? 'Загрузка...' : 'Загрузить фото'}
            </button>
          </div>
        </div>

        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Имя персонажа"
          className="h-[50px] px-4 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold"
          required
        />

        <SearchSelect
          label="Книга"
          value={form.book_id ? [Number(form.book_id)] : []}
          options={books.map(b => ({ id: b.id, label: b.title }))}
          onChange={(ids) => setForm({ ...form, book_id: ids[0] || '' })}
          placeholder="Выберите книгу..."
          multiple={false}
        />

        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Описание"
          className="col-span-full min-h-[80px] p-4 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold"
        />
        <textarea
          value={form.system_prompt}
          onChange={(e) => setForm({ ...form, system_prompt: e.target.value })}
          placeholder="Системный промпт (характер)"
          className="col-span-full min-h-[80px] p-4 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold"
        />
        <button type="submit" className="col-span-full h-[50px] bg-gold text-white rounded-lg hover:bg-gold-hover uppercase tracking-wider">
          Добавить
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {items.map((i) => (
          <div key={i.id} className="flex justify-between items-center p-3 bg-paper rounded-lg border border-border-light">
            <div className="flex items-center gap-3">
              {i.photo ? (
                <img src={i.photo} className="w-10 h-10 rounded-full object-cover" alt="" />
              ) : (
                <div className="w-10 h-10 bg-border-light rounded-full" />
              )}
              <span>{i.name}</span>
            </div>
            <button onClick={() => handleDelete(i.id)} className="text-red-500 text-sm">Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}