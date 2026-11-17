import { useEffect, useState, useRef } from 'react';
import apiClient from '../../api/client';
import { toast } from 'sonner';

export default function AdminPublishers() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', logo: '' });
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const load = () => apiClient.get('/publishers').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const { data } = await apiClient.post('/uploads/publisher-logo', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(prev => ({ ...prev, logo: data.url }));
      toast.success('Логотип загружен');
    } catch { toast.error('Ошибка'); } finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await apiClient.patch(`/publishers/${editId}`, form);
        toast.success('Обновлено');
      } else {
        await apiClient.post('/publishers', form);
        toast.success('Добавлено');
      }
      setForm({ name: '', logo: '' });
      setEditId(null);
      load();
    } catch { toast.error('Ошибка'); }
  };

  const handleEdit = (pub) => {
    setForm({ name: pub.name, logo: pub.logo || '' });
    setEditId(pub.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить?')) return;
    try { await apiClient.delete(`/publishers/${id}`); load(); } catch { toast.error('Нельзя удалить'); }
  };

  return (
    <div className="bg-card border border-border-medium rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl text-ink mb-6">{editId ? 'Редактировать издательство' : 'Добавить издательство'}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8 bg-paper p-4 rounded-xl border border-border-light">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-24 h-16 bg-border-light rounded-lg overflow-hidden flex items-center justify-center border border-border-medium">
            {form.logo ? <img src={form.logo} alt="Логотип" className="w-full h-full object-contain bg-white" /> : <span className="text-muted text-xs">Нет лого</span>}
          </div>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-paper-dark border border-border-medium rounded-lg text-sm">
            {uploading ? '...' : 'Загрузить логотип'}
          </button>
        </div>
        <div className="flex gap-4">
          <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Название" className="flex-1 h-[50px] px-4 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold" required />
          <button type="submit" className="h-[50px] px-8 bg-gold text-white rounded-lg uppercase">{editId ? 'Сохранить' : 'Добавить'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: '', logo: '' }); }} className="h-[50px] px-8 border-2 border-border-dark rounded-lg uppercase">Отмена</button>}
        </div>
      </form>
      <div className="flex flex-col gap-2">
        {items.map(i => (
          <div key={i.id} className="flex justify-between items-center p-3 bg-paper rounded-lg border border-border-light">
            <div className="flex items-center gap-3">
              {i.logo ? <img src={i.logo} className="w-12 h-8 object-contain bg-white rounded border border-border-light" /> : <div className="w-12 h-8 bg-border-light rounded" />}
              <span>{i.name}</span>
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