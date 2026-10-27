import { Link } from 'react-router-dom';

export default function CatalogPage() {
  return (
    <div className="p-10">
      <Link to="/" className="text-gold hover:underline">← Назад</Link>
      <h1 className="text-4xl font-serif mt-6">Каталог книг</h1>
      <p className="text-muted mt-2">Здесь будет каталог всех книг.</p>
    </div>
  );
}