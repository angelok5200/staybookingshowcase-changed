
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Language } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, language, setLanguage }) => {
  const navigate = useNavigate();

  const translations = {
    en: {
      login: 'Sign In',
      register: 'Register',
      myBookings: 'My Bookings',
      logout: 'Logout',
    },
    de: {
      login: 'Anmelden',
      register: 'Registrieren',
      myBookings: 'Meine Buchungen',
      logout: 'Abmelden',
    }
  };

  const t = translations[language];

  return (
    <header className="bg-[#003580] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight hover:opacity-90 transition-opacity">
          StayBooking
        </Link>

        <div className="flex items-center space-gap-4 gap-6">
          <div className="flex items-center bg-white/10 rounded overflow-hidden">
            <button 
              onClick={() => setLanguage(Language.EN)}
              className={`px-3 py-1 text-xs font-semibold ${language === Language.EN ? 'bg-white text-[#003580]' : 'hover:bg-white/20'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage(Language.DE)}
              className={`px-3 py-1 text-xs font-semibold ${language === Language.DE ? 'bg-white text-[#003580]' : 'hover:bg-white/20'}`}
            >
              DE
            </button>
          </div>

          <nav className="flex items-center gap-6">
            {user ? (
              <>
                <Link to="/my-bookings" className="text-sm font-medium hover:underline">
                  {t.myBookings}
                </Link>
                <div className="flex items-center gap-4 border-l border-white/20 pl-6">
                  <span className="text-sm font-semibold hidden sm:inline">{user.name}</span>
                  <button 
                    onClick={() => { onLogout(); navigate('/'); }}
                    className="text-sm font-medium px-4 py-2 border border-white rounded hover:bg-white/10 transition"
                  >
                    {t.logout}
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium hover:underline">
                  {t.login}
                </Link>
                <Link 
                  to="/register" 
                  className="text-sm font-semibold bg-white text-[#003580] px-4 py-2 rounded hover:bg-gray-100 transition"
                >
                  {t.register}
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
