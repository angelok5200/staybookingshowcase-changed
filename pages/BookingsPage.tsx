
import React, { useState, useEffect } from 'react';
import { Booking, Language } from '../types';
import { api } from '../services/api';

interface BookingsPageProps {
  language: Language;
}

const BookingsPage: React.FC<BookingsPageProps> = ({ language }) => {
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [managedBookings, setManagedBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'my' | 'managed'>('my');
  const [loading, setLoading] = useState(true);

  const t = {
    en: { 
      title: 'My Bookings', 
      tabMy: 'My Trips', 
      tabManaged: 'Requests for my properties',
      noBookings: 'No bookings found.', 
      status: 'Status', 
      price: 'Total Price',
      confirm: 'Confirm',
      reject: 'Reject',
      guest: 'Guest'
    },
    de: { 
      title: 'Buchungsverwaltung', 
      tabMy: 'Meine Reisen', 
      tabManaged: 'Anfragen für meine Objekte',
      noBookings: 'Keine Buchungen gefunden.', 
      status: 'Status', 
      price: 'Gesamtpreis',
      confirm: 'Bestätigen',
      reject: 'Ablehnen',
      guest: 'Gast'
    }
  }[language];

  const fetchData = async () => {
    setLoading(true);
    try {
      const my = await api.get('/bookings/my');
      setMyBookings(my);
      
      const managed = await api.get('/bookings/managed');
      setManagedBookings(managed);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (id: number, action: 'confirm' | 'reject') => {
    try {
      await api.post(`/bookings/${id}/${action}`, {});
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const currentBookings = activeTab === 'my' ? myBookings : managedBookings;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t.title}</h1>

      <div className="flex border-b mb-8">
        <button 
          className={`px-6 py-3 font-semibold transition ${activeTab === 'my' ? 'border-b-2 border-[#0071c2] text-[#0071c2]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('my')}
        >
          {t.tabMy}
        </button>
        <button 
          className={`px-6 py-3 font-semibold transition ${activeTab === 'managed' ? 'border-b-2 border-[#0071c2] text-[#0071c2]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('managed')}
        >
          {t.tabManaged}
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-20">Loading...</div>
      ) : currentBookings.length > 0 ? (
        <div className="space-y-6">
          {currentBookings.map(booking => (
            <div key={booking.id} className="bg-white p-6 rounded-lg shadow border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition hover:shadow-md">
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-[#0071c2] mb-1">{booking.roomTitle}</h3>
                <p className="text-gray-600 mb-1">
                  {booking.checkIn} — {booking.checkOut}
                </p>
                {activeTab === 'managed' && (
                  <p className="text-sm text-gray-500 italic">
                    {t.guest}: {booking.userName} ({booking.userEmail})
                  </p>
                )}
              </div>
              <div className="flex flex-col md:items-end gap-3 min-w-[150px]">
                <div className="text-right">
                  <span className="text-lg font-bold block">€{booking.totalPrice}</span>
                  <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                
                {activeTab === 'managed' && booking.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAction(booking.id, 'confirm')}
                      className="text-xs bg-green-600 text-white px-3 py-2 rounded font-bold hover:bg-green-700"
                    >
                      {t.confirm}
                    </button>
                    <button 
                      onClick={() => handleAction(booking.id, 'reject')}
                      className="text-xs bg-red-600 text-white px-3 py-2 rounded font-bold hover:bg-red-700"
                    >
                      {t.reject}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">{t.noBookings}</p>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
