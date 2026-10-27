import HomeSection from '@/components/home/HomeSection';
import {
  mockLibraryBooks,
  mockCatalogBooks,
  mockAuthors,
  mockCharacters,
  mockPublishers,
} from '@/mocks/home';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HomeSection
        title="Моя Библиотека"
        items={mockLibraryBooks}
        cardType="book"
        detailsHref="/library"
        backgroundImage="/src/assets/images/patterns/library-bg.png"
        divider="shelf"
        cardsPerPage={4}
      />

      <HomeSection
        title="Каталог"
        items={mockCatalogBooks}
        cardType="book"
        detailsHref="/catalog"
        backgroundMode="full"
        divider="shelf"
      />

      <HomeSection
        title="Авторы"
        items={mockAuthors}
        cardType="author"
        detailsHref="/authors"
        backgroundMode="none"
        divider="line"
      />

      <HomeSection
        title="Персонажи"
        items={mockCharacters}
        cardType="character"
        detailsHref="/characters"
        backgroundMode="full"
        divider="line"
      />

      {/* 5. Издательства — без фона, три короткие линии */}
      <HomeSection
        title="Издательства"
        items={mockPublishers}
        cardType="publisher"
        detailsHref="/publishers"
        backgroundMode="none"
        divider="publisher-shelf"
        cardsPerPage={3}
      />
    </div>
  );
}