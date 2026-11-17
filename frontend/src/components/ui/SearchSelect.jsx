import { useEffect, useMemo, useRef, useState } from 'react';

export default function SearchSelect({
  label,
  value,              // массив выбранных id (или значений)
  options,            // [{ id, label }] — доступные варианты
  onChange,           // (newValue: array) => void
  allowCreate = false, // разрешить создавать новое «на лету»
  onCreate,           // (name) => Promise<{id, label}>  — вызывается, если allowCreate
  placeholder = 'Введите для поиска...',
  multiple = true,
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const containerRef = useRef(null);

  // Закрытие по клику снаружи
  useEffect(() => {
    const onDocClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(o => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const isSelected = (id) => value.includes(id);

  const handleSelect = (opt) => {
    if (multiple) {
      if (!isSelected(opt.id)) onChange([...value, opt.id]);
    } else {
      onChange([opt.id]);
      setOpen(false);
    }
    setQuery('');
  };

  const handleRemove = (id) => {
    onChange(value.filter(x => x !== id));
  };

  const handleCreate = async () => {
    const name = query.trim();
    if (!name || !onCreate) return;
    setCreating(true);
    try {
      const created = await onCreate(name);
      onChange(multiple ? [...value, created.id] : [created.id]);
      setQuery('');
      setOpen(false);
    } catch {
      // ошибки обрабатываются наверх (в onCreate)
    } finally {
      setCreating(false);
    }
  };

  const exactExists = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return false;
    return options.some(o => o.label.toLowerCase() === q);
  }, [options, query]);

  const selectedOptions = useMemo(
    () => value.map(id => options.find(o => o.id === id)).filter(Boolean),
    [value, options]
  );

  return (
    <div className="flex flex-col gap-1 relative" ref={containerRef}>
      {label && <label className="text-sm text-muted">{label}</label>}

      {/* Выбранные «теги» */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-1">
          {selectedOptions.map(opt => (
            <span
              key={opt.id}
              className="inline-flex items-center gap-1 bg-gold text-white text-sm px-3 py-1 rounded-full"
            >
              {opt.label}
              <button
                type="button"
                onClick={() => handleRemove(opt.id)}
                className="ml-1 hover:opacity-80"
                aria-label="Убрать"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        type="text"
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="h-[45px] px-3 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold"
      />

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-paper border border-border-medium rounded-lg shadow-lg z-30 max-h-[220px] overflow-y-auto">
          {filtered.length === 0 && !allowCreate && (
            <div className="px-3 py-2 text-sm text-muted">Ничего не найдено</div>
          )}

          {filtered.map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt)}
              className={`w-full text-left px-3 py-2 hover:bg-card text-sm ${
                isSelected(opt.id) ? 'text-gold font-medium' : 'text-ink'
              }`}
            >
              {opt.label}
              {isSelected(opt.id) && ' ✓'}
            </button>
          ))}

          {allowCreate && query.trim() && !exactExists && (
            <button
              type="button"
              onClick={handleCreate}
              disabled={creating}
              className="w-full text-left px-3 py-2 bg-gold/10 text-gold font-medium border-t border-border-light text-sm"
            >
              {creating ? 'Создаём...' : `+ Создать «${query.trim()}»`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}