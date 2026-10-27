// src/components/analytics/StatsRow.jsx
import StatsCard from './StatsCard';

export default function StatsRow({ items = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {items.map((item) => (
        <StatsCard key={item.id} label={item.label} value={item.value} />
      ))}
    </div>
  );
}