import { useRef, useState } from 'react';
import BookCard from '@components/ui/BookCard';
import AuthorCard from '@components/ui/AuthorCard';
import CharacterCard from '@components/ui/CharacterCard';
import PublisherCard from '@components/ui/PublisherCard';
import DetailsButton from '@components/ui/DetailsButton';
import SliderDots from '@components/ui/SliderDots';
import Shelf from './Shelf';
import PublisherShelf from './PublisherShelf';
import SectionDivider from './SectionDivider';
import ArrowLgIcon from '@assets/icons/arrow-lg.svg?react';
import PlusIcon from '@assets/icons/plus.svg?react'; // иконка плюса

const CARD_COMPONENTS = {
  book: BookCard,
  author: AuthorCard,
  character: CharacterCard,
  publisher: PublisherCard,
};

const CARD_MIN_WIDTH = {
  book: 326,
  author: 326,
  character: 326,
  publisher: 438,
};

const BG_PADDING = 60;

export default function HomeSection({
  title,
  items = [],
  cardType = 'book',
  detailsHref = '/',
  backgroundMode = 'none',
  divider = 'none',
  cardsPerPage = 4,
  showEmptyState = false, // <-- новый проп
  emptyStateText = 'Пока пусто',
  emptyStateHint = 'Добавьте первый элемент',
  emptyStateHref = '/library',
}) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const Card = CARD_COMPONENTS[cardType];
  const cardWidth = CARD_MIN_WIDTH[cardType];
  const gap = 34;
  const pageWidth = cardsPerPage * cardWidth + (cardsPerPage - 1) * gap;
  const pageCount = Math.max(1, Math.ceil(items.length / cardsPerPage));

  const scrollByPage = (dir) => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollBy({ left: dir * pageWidth, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    const index = Math.round(container.scrollLeft / (pageWidth + gap));
    setActiveIndex(Math.max(0, Math.min(index, pageCount - 1)));
  };

  const renderDivider = () => {
    if (divider === 'none') return null;
    if (divider === 'shelf') return <Shelf />;
    if (divider === 'publisher-shelf') return <PublisherShelf />;
    return <SectionDivider />;
  };

  const hasBackground = backgroundMode !== 'none';
  const isAtEnd = pageCount <= 1 || activeIndex >= pageCount - 1;
  const isEmpty = items.length === 0;

  const content = (
    <>
      <header className="flex items-center justify-center gap-4 md:gap-[61px] mx-auto w-full">
        <span className="h-px flex-1 bg-border-light" />
        <h2 className="text-2xl md:text-[48px] text-ink text-center leading-none whitespace-nowrap">
          {title}
        </h2>
        <span className="h-px flex-1 bg-border-light" />
      </header>

      <div className="w-full flex justify-center mt-8 md:mt-12">
        <div className="relative w-full">
          {/* Если элементов нет и передан showEmptyState — рендерим заглушку */}
          {isEmpty && showEmptyState ? (
            <a
              href={emptyStateHref}
              className="block w-full max-w-[1440px] mx-auto"
              aria-label={emptyStateText}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[34px]">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center w-full max-w-[326px] mx-auto">
                    <div className="w-full aspect-[326/437] bg-paper border border-book-border border-dashed flex flex-col items-center justify-center gap-3 text-muted px-4 text-center">
                      <div className="w-14 h-14 rounded-full bg-paper-dark flex items-center justify-center">
                        <PlusIcon className="w-7 h-7 text-gold" />
                      </div>
                      <p className="text-[14px] leading-tight">{emptyStateHint}</p>
                    </div>
                    <p className="text-[13px] sm:text-[14px] text-muted tracking-[0.28px] mt-2 text-center">
                      —
                    </p>
                  </div>
                ))}
              </div>
            </a>
          ) : (
            <>
              <button
                type="button"
                onClick={() => scrollByPage(-1)}
                disabled={activeIndex === 0}
                aria-label="Прокрутить влево"
                className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-[70px] h-[70px] rounded-full border border-gold-light bg-paper/90 items-center justify-center text-ink hover:bg-gold hover:border-gold hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLgIcon className="w-6 h-6 rotate-180" />
              </button>

              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex gap-[34px] overflow-x-auto scroll-smooth snap-x snap-mandatory px-1 md:px-[85px] pb-4 scrollbar-hide"
                style={{ scrollbarWidth: 'none' }}
              >
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="snap-start shrink-0"
                    style={{ width: cardWidth, maxWidth: '85vw' }}
                  >
                    <Card item={item} />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => scrollByPage(1)}
                disabled={isAtEnd}
                aria-label="Прокрутить вправо"
                className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-[70px] h-[70px] rounded-full border border-gold-light bg-paper/90 items-center justify-center text-ink hover:bg-gold hover:border-gold hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLgIcon className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>

      {renderDivider() && <div className="mt-8 md:mt-12">{renderDivider()}</div>}

      <div className="flex items-center justify-between gap-4 mt-6">
        <div className="w-[100px]" aria-hidden="true" />
        {!isEmpty && (
          <SliderDots
            count={pageCount}
            activeIndex={activeIndex}
            onDotClick={(i) => {
              const container = scrollRef.current;
              if (!container) return;
              container.scrollTo({ left: i * (pageWidth + gap), behavior: 'smooth' });
            }}
          />
        )}
        {isEmpty && <div className="w-[100px]" aria-hidden="true" />}
        <div className="w-[100px] flex justify-end">
          {!isEmpty || !showEmptyState ? (
            <DetailsButton to={detailsHref} highlight={isAtEnd} />
          ) : (
            <a href={emptyStateHref} className="text-[16px] text-gold hover:underline">
              Перейти →
            </a>
          )}
        </div>
      </div>
    </>
  );

  return (
    <section className="w-full bg-transparent">
      {hasBackground ? (
        <div className="w-full bg-card" style={{ paddingTop: BG_PADDING, paddingBottom: BG_PADDING }}>
          <div className="max-w-[1700px] mx-auto px-4 md:px-10">{content}</div>
        </div>
      ) : (
        <div className="max-w-[1700px] mx-auto px-4 md:px-10" style={{ paddingTop: BG_PADDING, paddingBottom: BG_PADDING }}>
          {content}
        </div>
      )}
    </section>
  );
}