
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Room, User, Language, Review } from '../types';
import { api } from '../services/api';

interface RoomPageProps {
  user: User | null;
  language: Language;
}

const RoomPage: React.FC<RoomPageProps> = ({ user, language }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookingDates, setBookingDates] = useState({ checkIn: '', checkOut: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const t = {
    en: {
      bookNow: 'Book Now',
      loginToBook: 'Login to Book',
      reviews: 'Reviews',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      success: 'Booking successful!',
      error: 'Error creating booking. Please check dates.',
      hostedBy: 'Hosted by',
      description: 'Description'
    },
    de: {
      bookNow: 'Jetzt buchen',
      loginToBook: 'Anmelden zum Buchen',
      reviews: 'Bewertungen',
      checkIn: 'Anreise',
      checkOut: 'Abreise',
      success: 'Buchung erfolgreich!',
      error: 'Fehler bei der Buchung. Daten prüfen.',
      hostedBy: 'Gastgeber:',
      description: 'Beschreibung'
    }
  }[language];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomData = await api.get(`/rooms/${id}`);
        const reviewsData = await api.get(`/rooms/${id}/reviews`);
        setRoom(roomData);
        setReviews(reviewsData);
      } catch (err) {
        // Fallback for demo if backend is not running
        setRoom({
          id: Number(id),
          title: 'Luxury Beachfront Apartment',
          description: 'A beautiful place to stay with amazing views and top-tier comfort.',
          city: 'Nice',
          pricePerNight: 120,
          maxGuests: 4,
          imageUrl: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80',
          ownerName: 'John Host'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setError('');
      await api.post('/bookings', {
        roomId: room?.id,
        checkIn: bookingDates.checkIn,
        checkOut: bookingDates.checkOut
      });
      alert(t.success);
      navigate('/my-bookings');
    } catch (err: any) {
      setError(err.message || t.error);
    }
  };

  if (loading) return <div className="p-8 text-center flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003580]"></div></div>;
  if (!room) return <div className="p-8 text-center">Room not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{room.title}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">{room.city}</span>
            <span className="text-sm">•</span>
            <span className="text-sm font-medium">{t.hostedBy} <span className="text-[#0071c2] font-bold">{room.ownerName}</span></span>
          </div>
        </div>
        
        <img src={room.imageUrl} alt={room.title} className="w-full h-[450px] object-cover rounded-2xl mb-8 shadow-md" />
        
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">{t.description}</h2>
          <p className="text-gray-700 leading-relaxed text-lg bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            {room.description}
          </p>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">{t.reviews} ({reviews.length})</h2>
          <div className="space-y-6">
            {reviews.length > 0 ? reviews.map(review => (
              <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#003580] rounded-full flex items-center justify-center text-white font-bold">
                      {review.userName.charAt(0)}
                    </div>
                    <span className="font-bold text-gray-900">{review.userName}</span>
                  </div>
                  <div className="flex text-yellow-400">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                </div>
                <p className="text-gray-700 italic">"{review.comment}"</p>
              </div>
            )) : <div className="bg-gray-50 p-8 rounded-xl text-center text-gray-400 italic">No reviews yet for this property.</div>}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 bg-white p-8 rounded-2xl border border-gray-200 shadow-2xl">
          <div className="flex items-baseline mb-6">
            <span className="text-3xl font-bold text-gray-900">€{room.pricePerNight}</span>
            <span className="text-gray-500 ml-1 text-lg">/ night</span>
          </div>

          <form onSubmit={handleBooking} className="space-y-5">
            {error && <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">{error}</div>}
            
            <div className="grid grid-cols-1 gap-4">
              <div className="relative">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">{t.checkIn}</label>
                <input 
                  type="date" 
                  required
                  className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:ring-2 focus:ring-[#0071c2] focus:border-[#0071c2] outline-none transition"
                  value={bookingDates.checkIn}
                  onChange={e => setBookingDates({...bookingDates, checkIn: e.target.value})}
                />
              </div>
              <div className="relative">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">{t.checkOut}</label>
                <input 
                  type="date" 
                  required
                  className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:ring-2 focus:ring-[#0071c2] focus:border-[#0071c2] outline-none transition"
                  value={bookingDates.checkOut}
                  onChange={e => setBookingDates({...bookingDates, checkOut: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit"
              className={`w-full ${user ? 'bg-[#0071c2]' : 'bg-gray-800'} text-white font-bold py-4 rounded-xl hover:opacity-90 transition text-lg mt-4 shadow-lg active:scale-95`}
            >
              {user ? t.bookNow : t.loginToBook}
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              You won't be charged yet.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
