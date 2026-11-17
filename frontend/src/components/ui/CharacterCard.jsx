import { Link } from 'react-router-dom';

export default function CharacterCard({ item }) {
  const { id, name, book, photo } = item;

  return (
    <Link
      to={`/character/${id}`}
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
      <p className="text-[13px] sm:text-[14px] text-muted tracking-[0.28px] mt-2 text-center">
        {book}
      </p>
    </Link>
  );
}