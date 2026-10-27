// src/components/chat/ChatHeader.jsx
export default function ChatHeader() {
  return (
    <header className="flex flex-col items-center gap-2 mb-12 w-full">
      <p className="text-[13px] tracking-[1.56px] text-[#7A7A7A]
                    uppercase text-center">
        Чат с искусственным интеллектом
      </p>

      <div className="flex items-center gap-[61px] w-full mt-6">
        <span className="h-px flex-1 bg-[#E0E0E0]" />
        <h1 className="text-[48px] text-ink text-center leading-none whitespace-nowrap">
          Чат
        </h1>
        <span className="h-px flex-1 bg-[#E0E0E0]" />
      </div>
    </header>
  );
}