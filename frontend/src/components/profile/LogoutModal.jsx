// src/components/profile/LogoutModal.jsx
import { useEffect } from 'react';

export default function LogoutModal({ open, onConfirm, onCancel }) {
  // Закрытие по Escape
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50
                 bg-black/40 backdrop-blur-sm
                 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-paper rounded-2xl
                   border border-[#E0E0E0]
                   shadow-[0_20px_60px_rgba(0,0,0,0.2)]
                   max-w-[440px] w-full
                   p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[28px] font-serif text-ink mb-3">
          Выйти из аккаунта?
        </h2>
        <p className="text-[16px] text-muted leading-relaxed mb-8">
          Вы уверены, что хотите выйти? Все несохранённые изменения будут потеряны.
        </p>

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3
                       text-[14px] tracking-[1.6px] uppercase
                       text-muted hover:text-ink transition-colors"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-3 rounded-lg
                       bg-red-500 text-white
                       text-[14px] tracking-[1.6px] uppercase
                       hover:bg-red-600 transition-colors"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}