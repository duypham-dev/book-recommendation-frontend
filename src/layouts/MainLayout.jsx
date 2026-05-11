import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header/Header';
import Footer from './Footer';
import AuthModal from '../components/auth/AuthModal';
import ThemeToggle from '../components/common/ThemeToggle';
import useAuth from '../hooks/useAuth';

const MainLayout = ({
  children,
  showHero = false,
  heroContent = null,
  onSearchSubmit,
  onGenreSelect,
}) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register' or 'forgot'
  const { user } = useAuth();
  const navigate = useNavigate();

  // Default search handler — navigates to AllBooks with keyword query param.
  // Individual pages can override via onSearchSubmit prop if needed.
  const defaultSearchHandler = useCallback((keyword) => {
    const trimmed = (keyword || '').trim();
    if (trimmed) {
      navigate(`/books?keyword=${encodeURIComponent(trimmed)}`);
    }
  }, [navigate]);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };


  return (
    <div className="min-h-[calc(100vh-120px)] bg-background dark:bg-gray-900 flex flex-col">
      <Header
        onAuthClick={openAuthModal}
        user={user}
        onSearchSubmit={onSearchSubmit ?? defaultSearchHandler}
        onGenreSelect={onGenreSelect}
      />
      {showHero && heroContent}
      <main className={`flex-1 max-w-7xl mx-auto w-full relative z-20 ${showHero ? "-mt-20" : "mt-5"}`}>
        {children}
      </main>
      <Footer />
      {/* Render AuthModal conditionally */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
          onModeChange={setAuthMode}
        />
      )}
      {!user && <ThemeToggle />}
    </div>

  );
};

export default MainLayout;

