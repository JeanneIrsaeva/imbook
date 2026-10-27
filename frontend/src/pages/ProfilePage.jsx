// src/pages/ProfilePage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileField from '@/components/profile/ProfileField';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import ProfileActions from '@/components/profile/ProfileActions';
import LogoutModal from '@/components/profile/LogoutModal';
import { mockUser } from '@/mocks/user';

export default function ProfilePage() {
  const navigate = useNavigate();

  // Основные данные
  const [user, setUser] = useState(mockUser);
  const [avatarPreview, setAvatarPreview] = useState(mockUser.avatar);
  const [avatarFile, setAvatarFile] = useState(null);

  // Режим редактирования
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(mockUser);   // черновик

  // Модалка выхода
  const [logoutOpen, setLogoutOpen] = useState(false);

  // Смена аватара
  const handleAvatarSelect = (file) => {
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    setAvatarFile(file);
  };

  // Начать редактирование — копируем данные в черновик
  const handleEdit = () => {
    setDraft({ ...user });
    setIsEditing(true);
  };

  // Изменение поля в черновике
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  };

  // Сохранить
  const handleSave = async () => {
    // TODO: когда будет API
    // await api.updateProfile(draft);
    // if (avatarFile) await api.uploadAvatar(avatarFile);

    setUser(draft);
    setIsEditing(false);
    setAvatarFile(null);
    console.log('✅ Сохранено:', draft);
  };

  // Отмена — откат к сохранённому
  const handleCancel = () => {
    setDraft({ ...user });
    setAvatarPreview(user.avatar);
    setAvatarFile(null);
    setIsEditing(false);
  };

  // Открыть модалку выхода
  const handleLogoutClick = () => {
    setLogoutOpen(true);
  };

  // Подтвердить выход
  const handleLogoutConfirm = () => {
    // TODO: очистить токен, вызвать /api/auth/logout
    // localStorage.removeItem('token');
    setLogoutOpen(false);
    navigate('/login');
  };

  // Используем draft в режиме редактирования, user — в просмотре
  const displayUser = isEditing ? draft : user;

  return (
    <div className="max-w-[1700px] mx-auto pt-[50px] pb-12 px-10">
      <ProfileHeader />

      <div className="grid grid-cols-1 lg:grid-cols-[446px_238px] gap-16 justify-center mt-12">
        {/* ЛЕВАЯ КОЛОНКА */}
        <div className="flex flex-col gap-5">
          <ProfileField
            label="Имя"
            name="name"
            value={displayUser.name}
            editable={isEditing}
            onChange={handleFieldChange}
          />
          <ProfileField
            label="Email"
            name="email"
            type="email"
            value={displayUser.email}
            editable={isEditing}
            onChange={handleFieldChange}
          />
          <ProfileField
            label="Пароль"
            name="password"
            type={isEditing ? 'text' : 'text'}
            value={displayUser.password}
            editable={isEditing}
            onChange={handleFieldChange}
          />
          <ProfileField
            label="Дата рождения"
            name="birthDate"
            type="text"
            value={displayUser.birthDate}
            editable={isEditing}
            onChange={handleFieldChange}
          />

          <ProfileActions
            isEditing={isEditing}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            onLogout={handleLogoutClick}
          />
        </div>

        {/* ПРАВАЯ КОЛОНКА */}
        <ProfileAvatar
          src={avatarPreview}
          name={displayUser.name}
          onSelect={handleAvatarSelect}
          disabled={!isEditing}
        />
      </div>

      {/* Модалка подтверждения выхода */}
      <LogoutModal
        open={logoutOpen}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setLogoutOpen(false)}
      />
    </div>
  );
}