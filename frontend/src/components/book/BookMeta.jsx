// src/components/book/BookMeta.jsx

const META_ITEMS = [
  { label: 'Автор',                    value: (b) => b.author },
  { label: 'Жанр',                     value: (b) => b.genres },
  { label: 'Количество страниц',       value: (b) => b.totalPages },
  { label: 'Текущая страница',         value: (b) => b.currentPage },
  { label: 'Год издания',              value: (b) => b.year },
  { label: 'Издательство',             value: (b) => b.publisher },
  { label: 'Серия',                    value: (b) => b.series },
  { label: 'Тип книги',                value: (b) => b.type },
  { label: 'Цена',                     value: (b) => b.price },
  { label: 'Дата начала чтения',       value: (b) => b.dateStart },
  { label: 'Дата окончания чтения',    value: (b) => b.dateEnd },
];

export default function BookMeta({ book }) {
  return (
    <dl className="flex flex-col gap-3 w-full">
      {META_ITEMS.map(({ label, value }) => (
        <div key={label} className="flex items-start gap-2">
          <dt className="font-serif text-[24px] text-[#181821] whitespace-nowrap">
            {label}:
          </dt>
          <dd className="text-[24px] text-[#7A7A7A]">
            {value(book)}
          </dd>
        </div>
      ))}
    </dl>
  );
}