// src/components/ui/BookCard.jsx
import { Link } from 'react-router-dom';

export default function BookCard({ item }) {
  const { id, title, author, cover } = item;

  return (
    <Link
      to={`/book/${id}`}
      className="flex flex-col items-center w-[326px] group no-underline"
    >
      {/* Обложка с рамкой */}
      <div className="w-[326px] h-[437px] p-[34px_26px]
                      bg-paper border border-[#E9E7DF]
                      flex items-center justify-center">
        <img
          src={cover}
          alt={`Обложка «${title}»`}
          className="w-[278px] h-[377px] object-cover shadow-md"
        />
      </div>

      <h3 className="text-[22px] text-ink text-center leading-tight mt-5
                     group-hover:text-gold transition-colors">
        {title}
      </h3>

      <p className="text-[14px] text-muted tracking-[0.28px]">
        {author}
      </p>
    </Link>
  );
}