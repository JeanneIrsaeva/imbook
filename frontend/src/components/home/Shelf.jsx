// src/components/home/Shelf.jsx
export default function Shelf() {
  return (
    <div
      className="w-full h-[20px] rounded-[4px] bg-[#E0E0E0]"
      style={{
        boxShadow: `
          0px 8px 24px rgba(0, 0, 0, 0.12),
          inset -4px -4px 4px rgba(0, 0, 0, 0.16),
          inset 4px 4px 4px #FFFFFF
        `,
      }}
    />
  );
}