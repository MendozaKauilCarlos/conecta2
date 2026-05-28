
import React, { useState, useEffect } from 'react';
import { FirebaseProvider } from './components/FirebaseProvider';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { ChatBot } from './components/ChatBot';
import { UserData } from './types';

function AppContent() {
  const [view, setView] = useState<'landing' | 'login' | 'dashboard'>('landing');
  const [user, setUser] = useState<UserData | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogin = (authenticatedUser: UserData) => {
    setUser(authenticatedUser);
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setView('landing');
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'dark bg-[#0a0f18]' : 'bg-neutral-50'}`}>
      {view === 'landing' && (
        <LandingPage 
          onSelect={() => setView('login')} 
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      )}
      
      {view === 'login' && (
        <LoginPage 
          onLogin={handleLogin}
          onBack={() => setView('landing')}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      )}
      
      {view === 'dashboard' && user && (
        <Dashboard 
          user={user}
          onUpdateProfile={(updatedUser) => setUser(updatedUser)}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      )}

      {/* Persistent global UI elements */}
      <ChatBot isDarkMode={isDarkMode} />
    </div>
  );
}

export default function App() {
  return (
    <FirebaseProvider>
      <AppContent />
    </FirebaseProvider>
  );
}
