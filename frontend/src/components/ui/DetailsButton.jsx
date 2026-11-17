import { Link } from 'react-router-dom';
import ArrowSmIcon from '@assets/icons/arrow-sm.svg?react';

export default function DetailsButton({ to = '#', highlight = false }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 text-[14px] sm:text-[16px] tracking-[0.32px] transition-colors no-underline ${
        highlight ? 'text-gold' : 'text-ink hover:text-gold'
      }`}
    >
      <span>Подробнее</span>
      <ArrowSmIcon className="w-3 h-3" />
    </Link>
  );
}