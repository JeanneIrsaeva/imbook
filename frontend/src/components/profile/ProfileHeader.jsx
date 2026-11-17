export default function ProfileHeader() {
  return (
    <header className="flex flex-col items-center gap-2 mb-8 md:mb-12">
      <p className="text-[13px] tracking-[1.56px] text-muted uppercase text-center">
        Ваш личный кабинет
      </p>
      <div className="flex items-center justify-center gap-4 md:gap-[61px] w-full mt-6">
        <span className="h-px flex-1 md:w-[459px] md:flex-none bg-border-light" />
        <h1 className="text-3xl md:text-[48px] text-ink text-center leading-none whitespace-nowrap">
          Профиль
        </h1>
        <span className="h-px flex-1 md:w-[459px] md:flex-none bg-border-light" />
      </div>
    </header>
  );
}