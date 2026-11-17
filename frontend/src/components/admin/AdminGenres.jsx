import { useEffect, useState } from 'react';
import apiClient from '../../api/client';
import { toast } from 'sonner';

export default function AdminGenres() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '' });
  const [editId, setEditId] = useState(null);

  const load = () => apiClient.get('/genres').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await apiClient.patch(`/genres/${editId}`, form);
        toast.success('Обновлено');
      } else {
        await apiClient.post('/genres', form);
        toast.success('Добавлено');
      }
      setForm({ name: '' });
      setEditId(null);
      load();
    } catch { toast.error('Ошибка'); }
  };

  const handleEdit = (genre) => {
    setForm({ name: genre.name });
    setEditId(genre.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить?')) return;
    try { await apiClient.delete(`/genres/${id}`); load(); } catch { toast.error('Нельзя удалить'); }
  };

  return (
    <div className="bg-card border border-border-medium rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl text-ink mb-6">{editId ? 'Редактировать жанр' : 'Добавить жанр'}</h2>
      <form onSubmit={handleSubmit} className="flex gap-4 mb-8 bg-paper p-4 rounded-xl border border-border-light">
        <input value={form.name} onChange={e => setForm({ name: e.target.value })} placeholder="Название" className="flex-1 h-[50px] px-4 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold" required />
        <button type="submit" className="h-[50px] px-8 bg-gold text-white rounded-lg uppercase">{editId ? 'Сохранить' : 'Добавить'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: '' }); }} className="h-[50px] px-8 border-2 border-border-dark rounded-lg uppercase">Отмена</button>}
      </form>
      <div className="flex flex-col gap-2">
        {items.map(i => (
          <div key={i.id} className="flex justify-between items-center p-3 bg-paper rounded-lg border border-border-light">
            <span>{i.name}</span>
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