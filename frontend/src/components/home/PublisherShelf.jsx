export default function PublisherShelf() {
  return (
    <div className="flex justify-center gap-4 md:gap-[53px] w-full">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-px w-full max-w-[438px] bg-border-dark" />
      ))}
    </div>
  );
}