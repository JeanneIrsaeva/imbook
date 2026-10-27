import { useParams, Link } from 'react-router-dom';

export default function CharacterPage() {
  const { id } = useParams();

  return (
    <div className="p-10">
      <Link to="/" className="text-gold hover:underline">← Назад</Link>
      <h1 className="text-4xl font-serif mt-6">Персонаж #{id}</h1>
      <p className="text-muted mt-2">Здесь будет информация о персонаже.</p>
    </div>
  );
}