import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import SearchIcon from '@assets/icons/search.svg?react';
import SlidersIcon from '@assets/icons/sliders.svg?react';
import MenuIcon from '@assets/icons/menu.svg?react';
import defaultAvatar from '/placeholder-avatar.png'; 
import FiltersPanel from './FiltersPanel';

const SEARCHABLE_PATHS = ['/catalog', '/authors', '/publishers', '/characters', '/library'];
const FILTERABLE_PATHS = ['/catalog', '/library', '/authors', '/publishers', '/characters'];

export default function Header({ onMenuOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const hasText = query.trim().length > 0;
  const showFilters = FILTERABLE_PATHS.includes(location.pathname);

  const loadUserAvatar = () => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) { setAvatar(defaultAvatar); return; }
      const u = JSON.parse(raw);
      setAvatar(u.avatar || defaultAvatar);
    } catch {
      setAvatar(defaultAvatar);
    }
  };

  useEffect(() => {
    loadUserAvatar();
    const onFocus = () => loadUserAvatar();
    const onUserUpdated = () => loadUserAvatar();
    window.addEventListener('focus', onFocus);
    window.addEventListener('user:updated', onUserUpdated);
    window.addEventListener('storage', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('user:updated', onUserUpdated);
      window.removeEventListener('storage', onFocus);
    };
  }, []);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [location.pathname, location.search]);

  const handleChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    if (SEARCHABLE_PATHS.includes(location.pathname)) {
      if (v.trim()) {
        navigate(`${location.pathname}?q=${encodeURIComponent(v.trim())}`, { replace: true });
      } else {
        navigate(location.pathname, { replace: true });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!SEARCHABLE_PATHS.includes(location.pathname)) {
      if (trimmed) navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      else navigate('/');
      return;
    }
    if (!trimmed) navigate(location.pathname);
    else navigate(`${location.pathname}?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <>
      <header className="w-full px-4 md:px-10 py-4 md:py-6 bg-paper flex items-center gap-3 md:gap-8">
        <button
          type="button"
          onClick={onMenuOpen}
          className="lg:hidden w-10 h-10 flex items-center justify-center text-ink"
          aria-label="Открыть меню"
        >
          <MenuIcon className="w-6 h-6" />
        </button>

        <form
          onSubmit={handleSubmit}
          className="group flex-1 min-w-0 flex items-center h-[50px] md:h-[60px] px-3 md:px-6 gap-2 md:gap-4 bg-paper-dark rounded-[25px] border border-black/[0.07] shadow-[0_4px_4px_rgba(0,0,0,0.25)] transition-colors duration-200"
        >
          <SearchIcon
            className={`w-5 h-5 md:w-[30px] md:h-[30px] shrink-0 transition-colors duration-200 group-focus-within:text-gold ${
              hasText ? 'text-gold' : 'text-ink'
            }`}
          />
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Поиск книг, авторов, издательств, персонажей..."
            className="flex-1 min-w-0 bg-transparent outline-none text-[14px] md:text-[16px] text-ink-soft placeholder:text-placeholder font-sans"
          />
          {showFilters && (
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              aria-label="Фильтры"
              className="hidden sm:flex hover:text-gold transition-colors"
            >
              <SlidersIcon className="w-6 h-6" />
            </button>
          )}
        </form>

        <Link to="/profile" className="shrink-0">
          <img
            src={avatar}
            alt="Профиль"
            className="w-10 h-10 md:w-[60px] md:h-[60px] rounded-full object-cover border border-border-light"
          />
        </Link>
      </header>

      <FiltersPanel open={filtersOpen} onClose={() => setFiltersOpen(false)} />
    </>
  );
}