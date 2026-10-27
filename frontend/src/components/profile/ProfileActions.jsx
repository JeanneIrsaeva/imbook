// src/components/profile/ProfileActions.jsx
export default function ProfileActions({
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onLogout,
}) {
  // ==== Режим просмотра ====
  if (!isEditing) {
    return (
      <div className="flex items-center gap-12 mt-2">
        <button
          type="button"
          onClick={onEdit}
          className="w-[199px] h-[61px]
                     border-2 border-[#C0C0C0]
                     flex items-center justify-center
                     text-[16px] tracking-[1.6px] uppercase
                     text-ink hover:border-gold hover:text-gold
                     transition-colors"
        >
          Редактировать
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="w-[199px] h-[61px]
                     border-2 border-[#C0C0C0]
                     flex items-center justify-center
                     text-[16px] tracking-[1.6px] uppercase
                     text-ink hover:border-red-500 hover:text-red-500
                     transition-colors"
        >
          Выйти
        </button>
      </div>
    );
  }

  // ==== Режим редактирования ====
  return (
    <div className="flex items-center gap-12 mt-2">
      <button
        type="button"
        onClick={onSave}
        className="w-[199px] h-[61px]
                   border-2 border-gold bg-gold
                   flex items-center justify-center
                   text-[16px] tracking-[1.6px] uppercase
                   text-white hover:bg-[#7A6839] hover:border-[#7A6839]
                   transition-colors"
      >
        Сохранить
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="w-[199px] h-[61px]
                   border-2 border-[#C0C0C0]
                   flex items-center justify-center
                   text-[16px] tracking-[1.6px] uppercase
                   text-ink hover:border-red-500 hover:text-red-500
                   transition-colors"
      >
        Отмена
      </button>
    </div>
  );
}