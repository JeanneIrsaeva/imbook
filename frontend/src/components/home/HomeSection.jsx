// src/components/home/HomeSection.jsx
import { useRef, useState } from 'react';
import SliderDots from '@/components/ui/SliderDots';
import DetailsButton from '@/components/ui/DetailsButton';
import Shelf from './Shelf';
import PublisherShelf from './PublisherShelf';
import SectionDivider from './SectionDivider';
import ArrowLgIcon from '@/assets/icons/arrow-lg.svg?react';
import BookCard from '@/components/ui/BookCard';
import AuthorCard from '@/components/ui/AuthorCard';
import CharacterCard from '@/components/ui/CharacterCard';
import PublisherCard from '@/components/ui/PublisherCard';

const CARD_DIMENSIONS = {
  book:      { width: 326, gap: 34 },
  author:    { width: 326, gap: 34 },
  character: { width: 326, gap: 34 },
  publisher: { width: 438, gap: 53 },
};

const CARD_COMPONENTS = {
  book: BookCard,
  author: AuthorCard,
  character: CharacterCard,
  publisher: PublisherCard,
};

const GAP_CARDS_TO_DIVIDER = 50;
const GAP_DIVIDER_TO_CONTROLS = 50;
const BG_PADDING = 50; // отступ фона от внутренностей сверху и снизу

export default function HomeSection({
  title,
  items = [],
  cardType = 'book',
  detailsHref = '#',
  backgroundMode = 'none',
  divider = 'line',
  cardsPerPage = 4,
}) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const CardComponent = CARD_COMPONENTS[cardType];
  const { width: cardWidth, gap: cardGap } = CARD_DIMENSIONS[cardType];

  const pageWidth =
    cardsPerPage * cardWidth + (cardsPerPage - 1) * cardGap;

  const pageCount = Math.max(1, Math.ceil(items.length / cardsPerPage));

  const scrollToPage = (index) => {
    const container = scrollRef.current;
    if (!container) return;
    const clamped = Math.max(0, Math.min(index, pageCount - 1));
    container.scrollTo({ left: clamped * pageWidth, behavior: 'smooth' });
    setActiveIndex(clamped);
  };

  const scrollByPage = (direction) => {
    scrollToPage(activeIndex + (direction === 'left' ? -1 : 1));
  };

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    const index = Math.round(container.scrollLeft / pageWidth);
    setActiveIndex(Math.max(0, Math.min(index, pageCount - 1)));
  };

  const isAtEnd = pageCount <= 1 || activeIndex >= pageCount - 1;

  const renderDivider = () => {
    if (divider === 'none') return null;
    if (divider === 'shelf') return <Shelf />;
    if (divider === 'publisher-shelf') return <PublisherShelf />;
    return <SectionDivider />;
  };

  const hasBackground = backgroundMode !== 'none';

  const content = (
    <>
      {/* Заголовок */}
      <header
        className="flex items-center justify-center gap-[61px] mx-auto"
        style={{ width: `${pageWidth}px` }}
      >
        <span className="h-px flex-1 bg-[#E0E0E0]" />
        <h2 className="text-[48px] text-ink text-center leading-none whitespace-nowrap">
          {title}
        </h2>
        <span className="h-px flex-1 bg-[#E0E0E0]" />
      </header>

      {/* Карусель */}
      <div
        className="w-full flex justify-center"
        style={{ marginTop: `${GAP_CARDS_TO_DIVIDER}px` }}
      >
        <div className="relative" style={{ width: `${pageWidth}px` }}>
          {/* Стрелка влево */}
          <button
            type="button"
            onClick={() => scrollByPage('left')}
            disabled={activeIndex === 0}
            aria-label="Прокрутить влево"
            className="absolute left-[-85px] top-1/2 -translate-y-1/2 z-10
                       w-[70px] h-[70px] rounded-full
                       border border-[#E5E3DA] bg-[#E5E3DAE6]
                       flex items-center justify-center text-ink
                       hover:bg-gold hover:border-gold hover:text-white
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition-colors"
          >
            <ArrowLgIcon className="w-6 h-6 rotate-180" />
          </button>

          {/* Окно карусели */}
          <div className="overflow-hidden">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto scroll-smooth
                         py-4 snap-x snap-mandatory
                         [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ gap: `${cardGap}px` }}
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  className="snap-start shrink-0"
                  style={{ width: `${cardWidth}px` }}
                >
                  <CardComponent item={item} />
                </div>
              ))}
            </div>
          </div>

          {/* Стрелка вправо */}
          <button
            type="button"
            onClick={() => scrollByPage('right')}
            disabled={activeIndex >= pageCount - 1}
            aria-label="Прокрутить вправо"
            className="absolute right-[-85px] top-1/2 -translate-y-1/2 z-10
                       w-[70px] h-[70px] rounded-full
                       border border-[#E5E3DA] bg-[#E5E3DAE6]
                       flex items-center justify-center text-ink
                       hover:bg-gold hover:border-gold hover:text-white
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition-colors"
          >
            <ArrowLgIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Нижняя часть — полка, дотсы, «Подробнее» */}
      <div
        className="mx-auto flex flex-col"
        style={{
          width: `${pageWidth}px`,
          marginTop: `${GAP_CARDS_TO_DIVIDER}px`,
        }}
      >
        {divider !== 'none' && <div>{renderDivider()}</div>}

        <div
          className="flex items-center justify-between gap-8"
          style={{ marginTop: `${GAP_DIVIDER_TO_CONTROLS}px` }}
        >
          <div className="w-[100px]" aria-hidden="true" />

          <SliderDots
            count={pageCount}
            activeIndex={activeIndex}
            onDotClick={scrollToPage}
          />

          <div className="w-[100px] flex justify-end">
            <DetailsButton to={detailsHref} highlight={isAtEnd} />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <section className="w-full bg-transparent">
      {hasBackground ? (
        <div
          className="w-full bg-[#EDEBE4]"
          style={{
            paddingTop: `${BG_PADDING}px`,
            paddingBottom: `${BG_PADDING}px`,
          }}
        >
          {content}
        </div>
      ) : (
        <div
          style={{
            paddingTop: `${BG_PADDING}px`,
            paddingBottom: `${BG_PADDING}px`,
          }}
        >
          {content}
        </div>
      )}
    </section>
  );
}