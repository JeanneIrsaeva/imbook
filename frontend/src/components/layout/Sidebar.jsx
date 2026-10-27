// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import Logo from '@/assets/icons/logo.svg?react';
import HomeIcon from '@/assets/icons/home.svg?react';
import LibraryIcon from '@/assets/icons/library.svg?react';
import ChatIcon from '@/assets/icons/chat.svg?react';
import AnalyticsIcon from '@/assets/icons/analytics.svg?react';

const NAV_ITEMS = [
  { to: '/',          Icon: HomeIcon,      label: 'Главная' },
  { to: '/library',   Icon: LibraryIcon,   label: 'Моя библиотека' },
  { to: '/chat',      Icon: ChatIcon,      label: 'Чат с персонажем' },
  { to: '/analytics', Icon: AnalyticsIcon, label: 'Аналитика' },
];

export default function Sidebar() {
  return (
    <aside
      className="w-[120px] shrink-0
                 bg-sidebar border-r border-sidebar-border
                 flex flex-col items-center
                 px-[30px] py-[46px]"
    >
      {/* Логотип сверху */}
      <NavLink
        to="/"
        aria-label="На главную"
        className="shrink-0 hover:opacity-80 transition-opacity"
      >
        <Logo className="w-[60px] h-[60px]" />
      </NavLink>

      {/* Навигация — отступ 240px от логотипа */}
      <nav className="flex flex-col items-center gap-[50px] w-full mt-[240px]">
        {NAV_ITEMS.map(({ to, Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={label}
            className={({ isActive }) =>
              `group transition-colors duration-200 ${
                isActive ? 'text-gold' : 'text-ink-deep hover:text-gold'
              }`
            }
          >
            {({ isActive }) => (
              <Icon
                className={`w-[60px] h-[60px] transition-colors duration-200
                  ${isActive ? 'text-gold' : 'text-ink-deep group-hover:text-gold'}
                `}
              />
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}