import { NavLink } from 'react-router-dom';
import Logo from '@assets/icons/logo.svg?react';
import HomeIcon from '@assets/icons/home.svg?react';
import LibraryIcon from '@assets/icons/library.svg?react';
import ChatIcon from '@assets/icons/chat.svg?react';
import AnalyticsIcon from '@assets/icons/analytics.svg?react';
import { isAdmin } from '../../api/auth';

const NAV_ITEMS = [
  { to: '/', Icon: HomeIcon, label: 'Главная' },
  { to: '/library', Icon: LibraryIcon, label: 'Моя библиотека' },
  { to: '/chat', Icon: ChatIcon, label: 'Чат с персонажем' },
  { to: '/analytics', Icon: AnalyticsIcon, label: 'Аналитика' },
];

export default function MobileMenu({ open, onClose }) {
  if (!open) return null;
  const admin = isAdmin();

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute left-0 top-0 h-full w-[280px] bg-sidebar border-r border-sidebar-border flex flex-col items-center py-8 px-6 gap-10 overflow-y-auto">
        <NavLink to="/" onClick={onClose}>
          <Logo className="w-14 h-14" />
        </NavLink>

        <nav className="flex flex-col gap-8 w-full">
          {NAV_ITEMS.map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 text-[18px] ${
                  isActive ? 'text-gold' : 'text-ink-deep hover:text-gold'
                }`
              }
            >
              <Icon className="w-8 h-8" />
              {label}
            </NavLink>
          ))}

          {admin && (
            <NavLink
              to="/admin"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 text-[18px] ${
                  isActive ? 'text-gold' : 'text-ink-deep hover:text-gold'
                }`
              }
            >
              <span className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[9px] font-bold uppercase">
                Adm
              </span>
              Админ-панель
            </NavLink>
          )}
        </nav>
      </aside>
    </div>
  );
}