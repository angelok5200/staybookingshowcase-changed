
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Language } from '../types';
import { api } from '../services/api';

interface LoginPageProps {
  setUser: (user: User) => void;
  language: Language;
}

const LoginPage: React.FC<LoginPageProps> = ({ setUser, language }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const t = {
    en: { 
      title: 'Sign in', 
      email: 'Email', 
      password: 'Password', 
      submit: 'Sign in', 
      noAccount: "Don't have an account?",
      error: 'Invalid email or password.'
    },
    de: { 
      title: 'Anmelden', 
      email: 'E-Mail', 
      password: 'Passwort', 
      submit: 'Anmelden', 
      noAccount: 'Noch kein Konto?',
      error: 'Ungültige E-Mail oder Passwort.'
    }
  }[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      navigate('/');
    } catch (err: any) {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center">{t.title}</h1>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">{t.email}</label>
            <input 
              type="email" 
              required
              disabled={loading}
              className="w-full border p-3 rounded focus:ring-2 focus:ring-[#0071c2] outline-none"
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">{t.password}</label>
            <input 
              type="password" 
              required
              disabled={loading}
              className="w-full border p-3 rounded focus:ring-2 focus:ring-[#0071c2] outline-none"
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-[#0071c2] text-white font-bold py-3 rounded transition mt-4 ${loading ? 'opacity-50' : 'hover:bg-[#005da3]'}`}
          >
            {loading ? '...' : t.submit}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          {t.noAccount} <Link to="/register" className="text-[#0071c2] font-bold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
