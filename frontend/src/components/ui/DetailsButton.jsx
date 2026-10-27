// src/components/ui/DetailsButton.jsx
import { Link } from 'react-router-dom';
import ArrowSmIcon from '@/assets/icons/arrow-sm.svg?react';

export default function DetailsButton({ to = '#' }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2
                 text-[16px] text-ink tracking-[0.32px]
                 hover:text-gold transition-colors no-underline"
    >
      <span>Подробнее</span>
      <ArrowSmIcon className="w-3 h-3" />
    </Link>
  );
}