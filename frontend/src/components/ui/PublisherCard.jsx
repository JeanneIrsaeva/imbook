import { Link } from 'react-router-dom';

export default function PublisherCard({ item }) {
  const { id, name, logo } = item;

  return (
    <Link
      to={`/publisher/${id}`}
      className="flex flex-col items-center w-full max-w-[438px] mx-auto group no-underline"
    >
      <div className="w-full aspect-[438/328] bg-paper border border-book-border flex items-center justify-center overflow-hidden">
        <img
          src={logo}
          alt={name}
          className="max-w-[70%] max-h-[70%] object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <p className="text-[20px] sm:text-[26px] text-ink mt-4 sm:mt-[30px] text-center font-serif">
        {name}
      </p>
    </Link>
  );
}