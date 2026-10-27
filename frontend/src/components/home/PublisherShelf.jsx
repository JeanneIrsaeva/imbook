export default function PublisherShelf() {
  return (
    <div className="flex justify-center gap-[53px] w-full">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-px w-[438px] bg-[#C7C7C7]"
        />
      ))}
    </div>
  );
}