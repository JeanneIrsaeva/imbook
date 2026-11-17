import { useEffect, useState, useRef } from 'react';
import apiClient from '../../api/client';
import { toast } from 'sonner';

export default function AdminAuthors() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ last_name: '', first_name: '', middle_name: '', biography: '', photo: '' });
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const load = () => apiClient.get('/authors').then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const { data } = await apiClient.post('/uploads/author-photo', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm((prev) => ({ ...prev, photo: data.url }));
      toast.success('Фото загружено');
    } catch { toast.error('Ошибка'); } finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await apiClient.patch(`/authors/${editId}`, form);
        toast.success('Автор обновлен');
      } else {
        await apiClient.post('/authors', form);
        toast.success('Автор добавлен');
      }
      setForm({ last_name: '', first_name: '', middle_name: '', biography: '', photo: '' });
      setEditId(null);
      load();
    } catch { toast.error('Ошибка'); }
  };

  const handleEdit = (author) => {
    setForm({ last_name: author.last_name, first_name: author.first_name, middle_name: author.middle_name || '', biography: author.biography || '', photo: author.photo || '' });
    setEditId(author.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить?')) return;
    try { await apiClient.delete(`/authors/${id}`); load(); } catch { toast.error('Ошибка'); }
  };

  return (
    <div className="bg-card border border-border-medium rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl text-ink mb-6">{editId ? 'Редактировать автора' : 'Добавить автора'}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-paper p-4 rounded-xl border border-border-light">
        <div className="col-span-full flex items-center gap-4 mb-2">
          <div className="w-20 h-20 bg-border-light rounded-full overflow-hidden flex items-center justify-center">
            {form.photo ? <img src={form.photo} alt="Фото" className="w-full h-full object-cover" /> : <span className="text-muted text-xs">Нет фото</span>}
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-paper-dark border border-border-medium rounded-lg text-sm">
            {uploading ? '...' : 'Загрузить фото'}
          </button>
        </div>
        <input value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} placeholder="Фамилия" className="h-[50px] px-4 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold" required />
        <input value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} placeholder="Имя" className="h-[50px] px-4 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold" required />
        <input value={form.middle_name} onChange={e => setForm({...form, middle_name: e.target.value})} placeholder="Отчество" className="h-[50px] px-4 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold" />
        <textarea value={form.biography} onChange={e => setForm({...form, biography: e.target.value})} placeholder="Биография" className="col-span-full min-h-[80px] p-4 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold" />
        <div className="col-span-full flex gap-4">
          <button type="submit" className="h-[50px] px-8 bg-gold text-white rounded-lg uppercase">{editId ? 'Сохранить' : 'Добавить'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ last_name: '', first_name: '', middle_name: '', biography: '', photo: '' }); }} className="h-[50px] px-8 border-2 border-border-dark rounded-lg uppercase">Отмена</button>}
        </div>
      </form>
      <div className="flex flex-col gap-2">
        {items.map(i => (
          <div key={i.id} className="flex justify-between items-center p-3 bg-paper rounded-lg border border-border-light">
            <div className="flex items-center gap-3">
              {i.photo ? <img src={i.photo} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 bg-border-light rounded-full" />}
              <span>{i.last_name} {i.first_name}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(i)} className="text-gold text-sm">Ред.</button>
              <button onClick={() => handleDelete(i.id)} className="text-red-500 text-sm">Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}