// src/components/library/EmptyState.jsx
import { Link } from 'react-router-dom';

// Тексты под каждый таб
const EMPTY_MESSAGES = {
  all: {
    title: 'У вас пока нет книг',
    description: 'Добавьте первую книгу в библиотеку, чтобы начать отслеживать прогресс чтения.',
  },
  planned: {
    title: 'У вас нет запланированных книг',
    description: 'Добавьте книгу в список «Планирую» — так вы не забудете, что хотите прочитать.',
  },
  reading: {
    title: 'У вас нет книг в процессе чтения',
    description: 'Начните читать книгу и отметьте её статус «Читаю», чтобы отслеживать прогресс.',
  },
  read: {
    title: 'У вас нет прочитанных книг',
    description: 'Закончите книгу и отметьте её как «Прочитано» — она появится здесь.',
  },
};

export default function EmptyState({ tab = 'all' }) {
  const { title, description } = EMPTY_MESSAGES[tab] ?? EMPTY_MESSAGES.all;

  return (
    <div className="flex flex-col items-center justify-center
                    py-24 px-6 text-center
                    border border-dashed border-[#E0E0E0] rounded-2xl">
      {/* Иконка — открытая книга */}
      <svg
        width="80" height="80" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1"
        className="text-[#C7C7C7] mb-8"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>

      <h3 className="text-[26px] text-ink font-serif mb-4">
        {title}
      </h3>

      <p className="text-[16px] text-muted leading-relaxed max-w-[500px] mb-8">
        {description}
      </p>

      <Link
        to="/catalog"
        className="inline-flex items-center gap-2
                   px-8 py-3 rounded-full
                   bg-gold text-white
                   text-[16px] tracking-[0.32px]
                   hover:bg-[#7A6839] transition-colors no-underline"
      >
        Перейти в каталог
      </Link>
    </div>
  );
}