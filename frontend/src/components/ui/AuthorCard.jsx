// src/components/ui/AuthorCard.jsx
import { Link } from 'react-router-dom';

export default function AuthorCard({ item }) {
  const { id, name, photo } = item;

  return (
    <Link
      to={`/author/${id}`}
      className="flex flex-col items-center w-[326px] group no-underline"
    >
      {/* Фото с рамкой */}
      <div className="w-[326px] h-[326px]
                      bg-paper border border-[#E9E7DF]
                      flex items-center justify-center overflow-hidden">
        <img
          src={photo}
          alt={name}
          className="w-[218px] h-[218px] object-cover rounded-full"
        />
      </div>

      <h3 className="text-[22px] text-ink text-center leading-tight mt-6
                     group-hover:text-gold transition-colors">
        {name}
      </h3>
    </Link>
  );
}