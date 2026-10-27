import gannibal from '@/assets/images/books/gannibal.png';
import molchanie from '@/assets/images/books/molchanie-yagnyat.png';
import voshozhdenie from '@/assets/images/books/voshozhdenie-gannibala.png';
import krasnyyDrakon from '@/assets/images/books/krasnyy-drakon.png';

import authorHarris from '@/assets/images/authors/thomas-harris.png';
import eksmo from '@/assets/images/publishers/eksmo.png';
import charDolarhyde from '@/assets/images/characters/francis-dolarhyde.png';

// ============ КНИГИ ============
export const mockLibraryBooks = [
  { id: 1, title: 'Красный Дракон',         author: 'Томас Харрис', cover: krasnyyDrakon,  status: 'read' },
  { id: 2, title: 'Молчание Ягнят',         author: 'Томас Харрис', cover: molchanie,      status: 'reading' },
  { id: 3, title: 'Ганнибал',               author: 'Томас Харрис', cover: gannibal,       status: 'planned' },
  { id: 4, title: 'Восхождение Ганнибала',  author: 'Томас Харрис', cover: voshozhdenie,   status: 'read' },

  // Добавим ещё несколько, чтобы фильтр был заметен
  { id: 5, title: 'Война и мир',            author: 'Лев Толстой',  cover: krasnyyDrakon,  status: 'reading' },
  { id: 6, title: 'Преступление и наказание', author: 'Ф. Достоевский', cover: molchanie,   status: 'planned' },
  { id: 7, title: 'Мастер и Маргарита',     author: 'М. Булгаков',  cover: gannibal,       status: 'read' },
  { id: 8, title: 'Тихий Дон',              author: 'М. Шолохов',   cover: voshozhdenie,   status: 'planned' },
];

// Каталог — без status (это справочник, не личная библиотека)
export const mockCatalogBooks = [
  { id: 101, title: 'Восхождение Ганнибала', author: 'Томас Харрис', cover: voshozhdenie },
  { id: 102, title: 'Красный Дракон',        author: 'Томас Харрис', cover: krasnyyDrakon },
  { id: 103, title: 'Молчание Ягнят',        author: 'Томас Харрис', cover: molchanie },
  { id: 104, title: 'Ганнибал',              author: 'Томас Харрис', cover: gannibal },
];

// ============ АВТОРЫ ============
export const mockAuthors = [
  { id: 1, name: 'Томас Харрис',   photo: authorHarris },
  { id: 2, name: 'Томас Харрис',   photo: authorHarris },
  { id: 3, name: 'Томас Харрис',   photo: authorHarris },
  { id: 4, name: 'Томас Харрис',   photo: authorHarris },
];

// ============ ПЕРСОНАЖИ ============
export const mockCharacters = [
  { id: 1, name: 'Фрэнсис Долархайд', book: 'Красный Дракон',    photo: charDolarhyde },
  { id: 2, name: 'Фрэнсис Долархайд', book: 'Красный Дракон',    photo: charDolarhyde },
  { id: 3, name: 'Фрэнсис Долархайд', book: 'Красный Дракон',    photo: charDolarhyde },
  { id: 4, name: 'Фрэнсис Долархайд', book: 'Красный Дракон',    photo: charDolarhyde },
];

// ============ ИЗДАТЕЛЬСТВА ============
export const mockPublishers = [
  { id: 1, name: 'Эксмо',   logo: eksmo },
  { id: 1, name: 'Эксмо',   logo: eksmo },
  { id: 1, name: 'Эксмо',   logo: eksmo },
  { id: 1, name: 'Эксмо',   logo: eksmo },
];

// src/mocks/home.js

export const mockBookDetails = {
  id: 1,
  title: 'Красный Дракон',
  author: 'Томас Харрис',
  cover: krasnyyDrakon,
  rating: 5,                       // 0-5
  ratingValue: 0,                  // числовая оценка (0 в макете)
  genres: 'Триллер, Драма',
  totalPages: 475,
  currentPage: 377,
  progress: 76,                    // процент
  year: 1981,
  publisher: 'Эксмо',
  series: 'Магистраль',
  type: 'Физическая',
  price: 742,
  dateStart: '01.05.2026',
  dateEnd: '__.__.____',
  status: 'reading',               // planned / reading / read
  description:
    'Мы все безумцы или, может быть, это мир вокруг нас сошел с ума? Доктор Ганнибал Лектер, ' +
    'легендарный убийца-каннибал, попав за решетку, становится консультантом и союзником ФБР. ' +
    'Несомненно, Ганнибал Лектер — маньяк, но он и философ, и блестящий психиатр. Его мучает ' +
    'скука и отсутствие «интересных» книг в тюремной библиотеке. Зайдя в тупик в расследовании ' +
    'дела серийного убийцы, прозванного Красным Драконом, ФБР обращается к доктору Лектеру. ' +
    'Ведь только маньяк может понять маньяка. И Ганнибал Лектер принимает предложение. Для него ' +
    'важно доказать, что он умнее преступника, которого ищет ФБР.',
};