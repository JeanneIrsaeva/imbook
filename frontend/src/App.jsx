import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import HomePage from './pages/HomePage';
import LibraryPage from './pages/LibraryPage';
import BookPage from './pages/BookPage';
import AuthorPage from './pages/AuthorPage';
import CharacterPage from './pages/CharacterPage';
import PublisherPage from './pages/PublisherPage';
import CatalogPage from './pages/CatalogPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import AuthorsPage from './pages/AuthorsPage';
import PublishersPage from './pages/PublishersPage';
import CharactersPage from './pages/CharactersPage';
import SearchPage from './pages/SearchPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<HomePage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/book/:id" element={<BookPage />} />
        <Route path="/author/:id" element={<AuthorPage />} />
        <Route path="/character/:id" element={<CharacterPage />} />
        <Route path="/publisher/:id" element={<PublisherPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/chat" element={<ChatPage />} />

        {/* Глобальный поиск */}
        <Route path="/search" element={<SearchPage />} />

        {/* Каталоги классификаторов */}
        <Route path="/authors" element={<AuthorsPage />} />
        <Route path="/publishers" element={<PublishersPage />} />
        <Route path="/characters" element={<CharactersPage />} />

        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}