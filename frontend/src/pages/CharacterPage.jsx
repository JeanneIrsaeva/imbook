import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { toast } from 'sonner';

export default function CharacterPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await apiClient.get('/characters');
        const found = data.find(c => c.id === Number(id));
        if (!found) throw new Error('not found');
        setCharacter(found);
      } catch {
        toast.error('Персонаж не найден');
      }
    };
    load();
  }, [id]);

  const handleStartChat = async () => {
    if (!character?.is_available) {
      toast.error('Сначала дочитайте книгу — диалог откроется после отметки «Прочитано»');
      return;
    }
    setStarting(true);
    try {
      await apiClient.post('/chat/dialogs', { character_id: Number(id) });
      navigate('/chat');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Ошибка создания диалога');
    } finally {
      setStarting(false);
    }
  };

  if (!character) return <div className="p-20 text-center text-muted text-xl">Загрузка...</div>;

  return (
    <div className="max-w-[1700px] mx-auto py-8 md:py-12 px-4 md:px-10">
      <Link to="/characters" className="text-[16px] text-gold hover:underline">← Все персонажи</Link>

      <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-8 md:gap-16 mt-8 md:mt-12">
        <div className="w-full aspect-square bg-paper border border-book-border flex items-center justify-center overflow-hidden">
          {character.photo
            ? <img src={character.photo} alt={character.name} className="w-full h-full object-cover" />
            : <span className="text-muted text-lg">Нет фото</span>}
        </div>
        <div className="flex flex-col gap-4 md:gap-6">
          <h1 className="text-3xl md:text-[48px] text-ink leading-tight">{character.name}</h1>
          {character.description && (
            <p className="text-[16px] md:text-[20px] text-body leading-relaxed whitespace-pre-line">
              {character.description}
            </p>
          )}

          <button
            onClick={handleStartChat}
            disabled={starting || !character.is_available}
            className={`self-start mt-4 px-8 h-[56px] rounded-full text-[15px] tracking-[1.6px] uppercase transition-colors ${
              character.is_available
                ? 'bg-gold text-white hover:bg-gold-hover'
                : 'bg-border-light text-muted cursor-not-allowed border border-border-medium'
            } disabled:opacity-60`}
            title={!character.is_available ? 'Сначала дочитайте книгу' : ''}
          >
            {starting
              ? 'Открываем...'
              : character.is_available
                ? 'Начать диалог'
                : 'Диалог недоступен'}
          </button>

          {!character.is_available && (
            <p className="text-sm text-muted">
              Диалог откроется после того, как вы отметите книгу «Прочитано» в своей библиотеке.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}