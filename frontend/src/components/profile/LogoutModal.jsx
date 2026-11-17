export default function LogoutModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Затемнение фона */}
      <div 
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Само окно */}
      <div className="relative bg-paper border border-border-medium rounded-2xl p-8 max-w-[400px] w-full flex flex-col gap-6 shadow-xl">
        <h2 className="text-2xl text-ink font-serif text-center">Подтверждение</h2>
        <p className="text-ink text-center text-[16px]">
          Вы уверены, что хотите выйти из системы?
        </p>
        
        <div className="flex items-center justify-between gap-4 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-[50px] border-2 border-border-dark text-ink text-[14px] tracking-[1.6px] uppercase hover:border-gold hover:text-gold transition-colors rounded-lg"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-[50px] bg-red-500 text-white text-[14px] tracking-[1.6px] uppercase hover:bg-red-600 transition-colors rounded-lg"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}