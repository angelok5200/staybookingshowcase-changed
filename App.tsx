
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import RoomPage from './pages/RoomPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingsPage from './pages/BookingsPage';
import { User, Language } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header 
          user={user} 
          onLogout={handleLogout} 
          language={language} 
          setLanguage={setLanguage} 
        />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage language={language} />} />
            <Route path="/room/:id" element={<RoomPage user={user} language={language} />} />
            <Route path="/login" element={<LoginPage setUser={setUser} language={language} />} />
            <Route path="/register" element={<RegisterPage setUser={setUser} language={language} />} />
            <Route 
              path="/my-bookings" 
              element={user ? <BookingsPage language={language} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white py-8 px-4 mt-auto">
          <div className="max-w-7xl mx-auto text-center">
            <p>&copy; 2024 StayBooking MVP. Built for Portfolio.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
