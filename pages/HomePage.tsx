
import React, { useState, useEffect } from 'react';
import { Room, Language } from '../types';
import RoomCard from '../components/RoomCard';
import { api } from '../services/api';

interface HomePageProps {
  language: Language;
}

const HomePage: React.FC<HomePageProps> = ({ language }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState({ 
    city: '', 
    guests: 1,
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const t = {
    en: {
      hero: 'Find your next stay',
      subHero: 'Search deals on hotels, homes, and much more...',
      cityLabel: 'Where are you going?',
      guestsLabel: 'Guests',
      checkInLabel: 'Check-in',
      checkOutLabel: 'Check-out',
      searchBtn: 'Search',
      resultsTitle: 'Available Rooms',
    },
    de: {
      hero: 'Finden Sie Ihre nächste Unterkunft',
      subHero: 'Suchen Sie nach Angeboten für Hotels...',
      cityLabel: 'Wohin möchten Sie?',
      guestsLabel: 'Gäste',
      checkInLabel: 'Anreise',
      checkOutLabel: 'Abreise',
      searchBtn: 'Suchen',
      resultsTitle: 'Verfügbare Zimmer',
    }
  }[language];

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const query = `?city=${search.city}&guests=${search.guests}&checkIn=${search.checkIn}&checkOut=${search.checkOut}`;
      const data = await api.get(`/rooms${query}`);
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("HomePage Error:", err);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRooms();
  };

  return (
    <div className="pb-12">
      <div className="bg-[#003580] pt-8 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-white mb-8">
          <h1 className="text-4xl font-bold mb-2">{t.hero}</h1>
          <p className="text-xl opacity-90">{t.subHero}</p>
        </div>

        <form 
          onSubmit={handleSearch}
          className="max-w-7xl mx-auto bg-white p-4 rounded-lg shadow-xl grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 mb-1 uppercase">{t.cityLabel}</label>
            <input 
              type="text" 
              placeholder="e.g. Berlin"
              className="border p-2 rounded text-gray-800"
              value={search.city}
              onChange={e => setSearch({...search, city: e.target.value})}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 mb-1 uppercase">{t.checkInLabel}</label>
            <input 
              type="date" 
              className="border p-2 rounded text-gray-800"
              value={search.checkIn}
              onChange={e => setSearch({...search, checkIn: e.target.value})}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 mb-1 uppercase">{t.checkOutLabel}</label>
            <input 
              type="date" 
              className="border p-2 rounded text-gray-800"
              value={search.checkOut}
              onChange={e => setSearch({...search, checkOut: e.target.value})}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 mb-1 uppercase">{t.guestsLabel}</label>
            <input 
              type="number" 
              min="1"
              className="border p-2 rounded text-gray-800"
              value={search.guests}
              onChange={e => setSearch({...search, guests: parseInt(e.target.value) || 1})}
            />
          </div>
          <div className="flex items-end">
            <button 
              type="submit"
              className="w-full bg-[#0071c2] text-white font-bold py-3 rounded hover:bg-[#005da3] transition"
            >
              {t.searchBtn}
            </button>
          </div>
        </form>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <h2 className="text-2xl font-bold mb-6">{t.resultsTitle}</h2>
        {loading ? (
           <div className="text-center py-10">Loading available options...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.length > 0 ? (
              rooms.map(room => <RoomCard key={room.id} room={room} language={language} />)
            ) : (
              <p className="text-gray-500 italic col-span-3">No available rooms found for these dates.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
