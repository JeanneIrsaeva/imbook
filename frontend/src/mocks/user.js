// src/mocks/user.js
import defaultAvatar from '@/assets/images/avatars/default.png';

export const mockUser = {
  id: 1,
  name: 'Жанна',
  email: 'zhanna@example.com',
  password: '293019301239012',         // в реальности — только для отображения «●●●●»
  birthDate: '27.01.2006',
  avatar: defaultAvatar,
};