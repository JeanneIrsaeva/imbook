import { Link } from 'react-router-dom';

export default function AuthorCard({ item }) {
  const { id, name, photo } = item;

  return (
    <Link
      to={`/author/${id}`}
      className="flex flex-col items-center w-full max-w-[326px] mx-auto group no-underline"
    >
      <div className="w-full aspect-square bg-paper border border-book-border flex items-center justify-center overflow-hidden">
        <img
          src={photo}
          alt={name}
          className="w-[70%] h-[70%] object-cover rounded-full"
        />
      </div>
      <h3 className="text-[18px] sm:text-[22px] text-ink text-center leading-tight mt-4 sm:mt-6 group-hover:text-gold transition-colors">
        {name}
      </h3>
    </Link>
  );
}