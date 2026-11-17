import { Link } from 'react-router-dom';

export default function BookCard({ item, onClick }) {
  const { id, title, author, cover } = item;

  const content = (
    <>
      <div className="w-full aspect-[326/437] p-4 sm:p-[34px_26px] bg-paper border border-book-border flex items-center justify-center transition-shadow group-hover:shadow-lg">
        <img
          src={cover || '/placeholder-cover.png'}
          alt={`Обложка «${title}»`}
          className="w-full h-full object-cover shadow-md"
        />
      </div>
      <h3 className="text-[18px] sm:text-[22px] text-ink text-center leading-tight mt-4 sm:mt-5 group-hover:text-gold transition-colors line-clamp-2">
        {title}
      </h3>
      <p className="text-[13px] sm:text-[14px] text-muted tracking-[0.28px] mt-1 text-center line-clamp-1">
        {author}
      </p>
    </>
  );

  const baseClasses = "flex flex-col items-center w-full max-w-[326px] mx-auto group no-underline cursor-pointer";

  // Если передан onClick, рендерим кнопку/div, иначе Link
  if (onClick) {
    return (
      <div className={baseClasses} onClick={() => onClick(id)}>
        {content}
      </div>
    );
  }

  return (
    <Link to={`/book/${id}`} className={baseClasses}>
      {content}
    </Link>
  );
}