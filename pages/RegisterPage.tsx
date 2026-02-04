
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Language } from '../types';
import { api } from '../services/api';

interface RegisterPageProps {
  setUser: (user: User) => void;
  language: Language;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ setUser, language }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const t = {
    en: { 
      title: 'Register', 
      name: 'Name', 
      email: 'Email', 
      password: 'Password', 
      submit: 'Create Account', 
      hasAccount: 'Already have an account?',
      invalidEmail: 'Please enter a valid email address.',
      emailTaken: 'This email is already registered.'
    },
    de: { 
      title: 'Registrieren', 
      name: 'Name', 
      email: 'E-Mail', 
      password: 'Passwort', 
      submit: 'Konto erstellen', 
      hasAccount: 'Bereits ein Konto?',
      invalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
      emailTaken: 'Diese E-Mail ist bereits registriert.'
    }
  }[language];

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(formData.email)) {
      setError(t.invalidEmail);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/register', formData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      navigate('/');
    } catch (err: any) {
      if (err.message === 'Email taken') {
        setError(t.emailTaken);
      } else {
        setError(err.message || "An unexpected error occurred");
      }
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
            <label className="block text-sm font-bold text-gray-700 mb-1">{t.name}</label>
            <input 
              type="text" 
              required
              disabled={loading}
              className="w-full border p-3 rounded focus:ring-2 focus:ring-[#0071c2] outline-none"
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
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
            className={`w-full bg-[#0071c2] text-white font-bold py-3 rounded transition mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#005da3]'}`}
          >
            {loading ? '...' : t.submit}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          {t.hasAccount} <Link to="/login" className="text-[#0071c2] font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
