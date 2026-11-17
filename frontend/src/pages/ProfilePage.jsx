import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from '@components/profile/ProfileHeader';
import ProfileField from '@components/profile/ProfileField';
import ProfileAvatar from '@components/profile/ProfileAvatar';
import ProfileActions from '@components/profile/ProfileActions';
import LogoutModal from '@components/profile/LogoutModal';
import DeleteAccountModal from '@components/profile/DeleteAccountModal';
import apiClient from '../api/client';
import { getMe, logout } from '../api/auth';
import { toast } from 'sonner';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [draft, setDraft] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ old_password: '', new_password: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const me = await getMe();
        setUser(me);
        setDraft(me);
      } catch {
        toast.error('Не удалось загрузить профиль');
      }
    };
    load();
  }, []);

  const handleAvatarSelect = (file) => {
    setAvatarFile(file);
    setDraft((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));
  };

  const handleSave = async () => {
    try {
      const { data: updatedUser } = await apiClient.patch('/auth/me', {
        name: draft.name,
        email: draft.email,
      });

      let finalAvatar = updatedUser.avatar;

      if (avatarFile) {
        const fd = new FormData();
        fd.append('file', avatarFile);
        const { data: upload } = await apiClient.post('/uploads/avatar', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        finalAvatar = upload.url;
      }

      const finalUser = { ...updatedUser, avatar: finalAvatar };
      setUser(finalUser);
      setIsEditing(false);
      setAvatarFile(null);
      setDraft(finalUser);

      localStorage.setItem('user', JSON.stringify(finalUser));
      window.dispatchEvent(new Event('user:updated'));

      toast.success('Профиль обновлён');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Ошибка обновления');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/auth/me/password', passwords);
      toast.success('Пароль изменён');
      setShowPasswordForm(false);
      setPasswords({ old_password: '', new_password: '' });
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Ошибка смены пароля');
    }
  };

  const handleLogoutConfirm = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteConfirm = async () => {
    try {
      await apiClient.delete('/auth/me');
      toast.success('Аккаунт удалён');
      logout();
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Ошибка удаления');
    }
  };

  if (!user) return <div className="p-20 text-center text-muted">Загрузка...</div>;

  const display = isEditing ? draft : user;

  return (
    <div className="max-w-[1700px] mx-auto pt-8 md:pt-[50px] pb-8 md:pb-12 px-4 md:px-10">
      <ProfileHeader />
      <div className="grid grid-cols-1 lg:grid-cols-[446px_238px] gap-8 md:gap-16 justify-center mt-8 md:mt-12">
        <div className="flex flex-col gap-5">
          <ProfileField label="Имя" name="name" value={display.name} editable={isEditing} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          <ProfileField label="Email" name="email" type="email" value={display.email} editable={isEditing} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
          <ProfileField label="Пароль" name="password" value="********" editable={false} />
          <ProfileField label="Дата регистрации" name="created_at" value={new Date(display.created_at).toLocaleDateString('ru-RU')} editable={false} />

          <button
            type="button"
            onClick={() => setShowPasswordForm((v) => !v)}
            className="self-start text-[15px] text-gold hover:underline"
          >
            {showPasswordForm ? 'Отменить смену пароля' : 'Сменить пароль'}
          </button>

          {showPasswordForm && (
            <form onSubmit={handleChangePassword} className="flex flex-col gap-3 bg-card border border-border-medium rounded-xl p-4">
              <input
                type="password"
                placeholder="Текущий пароль"
                value={passwords.old_password}
                onChange={(e) => setPasswords({ ...passwords, old_password: e.target.value })}
                className="h-[48px] px-4 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold"
                required
              />
              <input
                type="password"
                placeholder="Новый пароль"
                value={passwords.new_password}
                onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                className="h-[48px] px-4 rounded-lg border border-border-medium bg-paper outline-none focus:border-gold"
                required
                minLength={8}
              />
              <button
                type="submit"
                className="h-[48px] bg-gold text-white rounded-lg text-[15px] tracking-[1.6px] uppercase hover:bg-gold-hover transition-colors"
              >
                Сохранить пароль
              </button>
            </form>
          )}
        </div>

        <div className="flex flex-col items-center gap-6">
          <ProfileAvatar
            src={display.avatar || '/placeholder-avatar.png'}
            name={display.name}
            onSelect={handleAvatarSelect}
            disabled={!isEditing}
          />
          <ProfileActions
            isEditing={isEditing}
            onEdit={() => { setDraft({ ...user }); setIsEditing(true); }}
            onSave={handleSave}
            onCancel={() => { setDraft({ ...user }); setIsEditing(false); }}
            onLogout={() => setLogoutOpen(true)}
          />
        </div>
      </div>

      {/* Опасная зона: удаление аккаунта */}
      <div className="mt-16 border-t border-border-light pt-8">
        <div className="max-w-[600px] mx-auto bg-card border border-border-medium rounded-2xl p-6 flex flex-col items-start gap-3">
          <h3 className="text-xl font-serif text-ink">Опасная зона</h3>
          <p className="text-[15px] text-muted leading-relaxed">
            Удаление аккаунта приведёт к безвозвратному удалению всех ваших данных: книг, карточек, заметок, цитат и диалогов.
          </p>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="mt-2 h-[48px] px-6 border-2 border-red-600 text-red-600 rounded-lg uppercase text-sm tracking-[1.6px] hover:bg-red-600 hover:text-white transition-colors"
          >
            Удалить аккаунт
          </button>
        </div>
      </div>

      <LogoutModal open={logoutOpen} onClose={() => setLogoutOpen(false)} onConfirm={handleLogoutConfirm} />
      <DeleteAccountModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDeleteConfirm} />
    </div>
  );
}