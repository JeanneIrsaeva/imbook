import apiClient from './client';

export const login = async (login, password) => {
  const form = new URLSearchParams();
  form.append('username', login);
  form.append('password', password);

  const { data } = await apiClient.post('/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);

  // Забираем данные пользователя (чтобы знать is_admin)
  const me = await getMe();
  localStorage.setItem('user', JSON.stringify(me));

  return data;
};

export const register = async (payload) => {
  const { data } = await apiClient.post('/auth/register', payload);

  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);

  const me = await getMe();
  localStorage.setItem('user', JSON.stringify(me));

  return data;
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

export const getMe = async () => {
  const { data } = await apiClient.get('/auth/me');
  return data;
};

export const isAuthenticated = () => !!localStorage.getItem('access_token');

export const isAdmin = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return false;
    const user = JSON.parse(raw);
    return user?.is_admin === true;
  } catch {
    return false;
  }
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};