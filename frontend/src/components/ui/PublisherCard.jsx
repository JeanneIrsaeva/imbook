import { Link } from 'react-router-dom';

export default function PublisherCard({ item }) {
  const { id, name, logo } = item;

  return (
    <Link
      to={`/publisher/${id}`}
      className="flex flex-col items-center w-[438px] group no-underline"
    >
      {/* Логотип в рамке 438×328 */}
      <div className="w-[438px] h-[328px]
                      bg-[#F3F2EC] border border-[#E9E7DF]
                      flex items-center justify-center overflow-hidden">
        <img
          src={logo}
          alt={name}
          className="max-w-[70%] max-h-[70%] object-contain
                     group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Подпись */}
      <p className="text-[26px] text-ink leading-[43.2px]
                    mt-[30px] text-center">
        {name}
      </p>
    </Link>
  );
}