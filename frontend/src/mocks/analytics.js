// src/mocks/analytics.js

// Карточки сверху
export const mockStatsCards = [
  { id: 'total',    label: 'Всего книг',           value: '11' },
  { id: 'read',     label: 'Прочитано книг',       value: '17' },
  { id: 'pages',    label: 'Прочитано страниц',    value: '11.8M' },
  { id: 'price',    label: 'Стоимость библиотеки', value: '11.000' },
];

// Диаграмма по статусам
export const mockStatusDistribution = [
  { id: 'reading',  label: 'Читаю',     value: 13, percent: 8.2, color: '#75391D' },
  { id: 'planned',  label: 'Планирую',  value: 13, percent: 8.2, color: '#A26745' },
  { id: 'read',     label: 'Прочитано', value: 13, percent: 8.2, color: '#CFBDA7' },
];

// Диаграмма по жанрам
export const mockGenreDistribution = [
  { id: 'drama',   label: 'Драма',    value: 13, percent: 8.2, color: '#38130A' },
  { id: 'horror',  label: 'Ужасы',    value: 13, percent: 8.2, color: '#75391D' },
  { id: 'detect',  label: 'Детектив', value: 13, percent: 8.2, color: '#A26745' },
  { id: 'fantasy', label: 'Фэнтези',  value: 13, percent: 8.2, color: '#CFBDA7' },
];

// Прочитанные книги по месяцам
export const mockBooksByMonth = {
  months: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  values: [2, 3, 1, 4, 2, 5, 3, 2, 4, 3, 5, 4],
  color: '#75391D',
};

// Потрачено денег по месяцам
export const mockSpendingByMonth = {
  months: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  values: [800, 1200, 600, 2400, 1100, 1800, 900, 700, 1500, 1200, 2200, 1000],
  color: '#A26745',
  year: '2026',
};