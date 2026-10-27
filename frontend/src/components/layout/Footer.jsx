// src/components/layout/Footer.jsx
import Logo from '@/assets/icons/logo.svg?react';

const NAV_LINKS = [
  { label: 'Главная', to: '/' },
  { label: 'Моя библиотека', to: '/library' },
  { label: 'Чат', to: '/chat' },
  { label: 'Аналитика', to: '/analytics' },
];

const SECTION_LINKS = [
  { label: 'Каталог', to: '/catalog' },
  { label: 'Авторы', to: '/authors' },
  { label: 'Персонажи', to: '/characters' },
  { label: 'Издательства', to: '/publishers' },
];

export default function Footer() {
  return (
    <footer className="w-full bg-footer">
      <div className="max-w-[1800px] mx-auto px-10 py-12 flex flex-col gap-16">

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-[200px] lg:pl-[calc((100%-1094px)/2)]">
          
          <div className="flex flex-col gap-[17px] max-w-[428px]">
            <Logo className="w-[60px] h-[60px]" />

            <p className="text-[18px] font-medium leading-normal tracking-[-0.2px] text-ink-deep">
              <span className="font-serif">Иммерсивный книжный трекер</span> — интерактивная
              веб-платформа, которая превращает чтение в живой эмоциональный
              опыт, объединяя учёт личной библиотеки и прогресса чтения
              с уникальной возможностью общаться с персонажами книг через ИИ.
            </p>
          </div>

          {/* Навигация */}
          <nav className="flex flex-col gap-5">
            <h3 className="text-[20px] font-normal tracking-[-0.23px] text-ink-soft">
              Навигация
            </h3>
            <ul className="flex flex-col gap-5">
              {NAV_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <a
                    href={to}
                    className="text-[18px] text-ink-deep hover:text-gold transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Разделы */}
          <nav className="flex flex-col gap-5">
            <h3 className="text-[20px] font-normal tracking-[-0.23px] text-ink-soft">
              Разделы
            </h3>
            <ul className="flex flex-col gap-5">
              {SECTION_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <a
                    href={to}
                    className="text-[18px] text-ink-deep hover:text-gold transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4
                        w-full max-w-[1349px] mx-auto">
          <p className="text-[15px] font-quicksand font-medium tracking-[-0.2px] text-ink-deep opacity-50">
            Если чьи-то ресурсы буду использовать, указать авторов
          </p>

          <a
            href="/privacy"
            className="text-[15px] font-quicksand font-medium tracking-[-0.2px] text-ink-deep hover:text-gold transition-colors"
          >
            Политика конфиденциальности
          </a>
        </div>

      </div>
    </footer>
  );
}