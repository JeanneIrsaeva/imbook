import { useParams, Link } from 'react-router-dom';

export default function AuthorPage() {
  const { id } = useParams();

  return (
    <div className="p-10">
      <Link to="/" className="text-gold hover:underline">← Назад</Link>
      <h1 className="text-4xl font-serif mt-6">Автор #{id}</h1>
      <p className="text-muted mt-2">Здесь будет биография автора и его книги.</p>
    </div>
  );
}