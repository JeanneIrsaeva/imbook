import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api/auth';
import { toast } from 'sonner';

// Поле с плавающим лейблом
const FloatingInput = ({ label, type = 'text', value, onChange, required }) => {
  return (
    <div className="relative w-full h-[60px]">
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="absolute inset-0 w-full h-full bg-transparent border-2 border-border-medium rounded-[10px] px-5 outline-none focus:border-gold transition-colors peer text-ink"
      />
      <label className="absolute left-4 top-1/2 -translate-y-1/2 bg-paper px-2 text-muted transition-all peer-focus:-top-0 peer-focus:text-[14px] peer-focus:text-gold peer-valid:-top-0 peer-valid:text-[14px] pointer-events-none">
        {label}
      </label>
    </div>
  );
};

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ login: '', password: '', email: '', name: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && form.password !== form.confirmPassword) {
      return toast.error('Пароли не совпадают');
    }
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.login, form.password);
      } else {
        await register({ login: form.login, password: form.password, email: form.email, name: form.name });
      }
      toast.success(isLogin ? 'Добро пожаловать!' : 'Регистрация успешна!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-[420px] flex flex-col gap-6">
        <h1 className="text-[30px] text-ink text-center font-serif">
          {isLogin ? 'Вход в систему' : 'Регистрация'}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4">
          {!isLogin && (
            <>
              <FloatingInput
                label="Имя"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <FloatingInput
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </>
          )}

          <FloatingInput
            label="Логин"
            value={form.login}
            onChange={(e) => setForm({ ...form, login: e.target.value })}
            required
          />

          <FloatingInput
            label="Пароль"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          {!isLogin && (
            <FloatingInput
              label="Повторите пароль"
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[61px] bg-gold text-white rounded-[10px] font-medium text-[16px] tracking-[0.26px] uppercase hover:bg-gold-hover transition-colors mt-2 disabled:opacity-60"
          >
            {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="text-center mt-2">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-gold hover:underline text-[15px]"
          >
            {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
        </div>
      </div>
    </div>
  );
}