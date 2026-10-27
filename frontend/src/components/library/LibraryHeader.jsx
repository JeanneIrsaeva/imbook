// src/components/library/LibraryHeader.jsx
export default function LibraryHeader() {
  return (
    <header className="flex flex-col items-center gap-2 mb-12">
      {/* Надзаголовок */}
      <p className="text-[13px] tracking-[1.56px] text-[#7A7A7A]
                    uppercase text-center">
        Ваши личные карточки книг
      </p>

      {/* Заголовок с линиями */}
      <div className="flex items-center justify-center gap-[61px] w-full mt-6">
        <span className="h-px w-[459px] bg-[#E0E0E0]" />
        <h1 className="text-[48px] text-ink text-center leading-none whitespace-nowrap">
          Моя Библиотека
        </h1>
        <span className="h-px w-[459px] bg-[#E0E0E0]" />
      </div>
    </header>
  );
}