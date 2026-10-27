// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ScaledLayout from '@/components/layout/ScaledLayout';
import HomePage from '@/pages/HomePage';
import LibraryPage from '@/pages/LibraryPage';
import BookPage from '@/pages/BookPage';
import AuthorPage from '@/pages/AuthorPage';
import CharacterPage from '@/pages/CharacterPage';
import PublisherPage from '@/pages/PublisherPage';
import CatalogPage from '@/pages/CatalogPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import ProfilePage from '@/pages/ProfilePage';
import ChatPage from '@/pages/ChatPage';
export default function App() {
  return (
    <ScaledLayout>
      <Routes>
        <Route element={<Layout />}>
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
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ScaledLayout>
  );
}