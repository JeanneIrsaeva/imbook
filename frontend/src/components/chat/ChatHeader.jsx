export default function ChatHeader() {
  return (
    <header className="flex flex-col items-center gap-2">
      <p className="text-[13px] tracking-[1.56px] text-muted uppercase text-center">
        Диалоги с персонажами
      </p>
      <div className="flex items-center justify-center gap-4 md:gap-[61px] w-full mt-6">
        <span className="h-px flex-1 md:w-[459px] md:flex-none bg-border-light" />
        <h1 className="text-3xl md:text-[48px] text-ink text-center leading-none whitespace-nowrap">
          Чат
        </h1>
        <span className="h-px flex-1 md:w-[459px] md:flex-none bg-border-light" />
      </div>
    </header>
  );
}