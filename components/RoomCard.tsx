
import React from 'react';
import { Link } from 'react-router-dom';
import { Room, Language } from '../types';

interface RoomCardProps {
  room: Room;
  language: Language;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, language }) => {
  const translations = {
    en: { perNight: 'per night', viewDetails: 'View Details', guests: 'guests', host: 'Host' },
    de: { perNight: 'pro Nacht', viewDetails: 'Details ansehen', guests: 'Gäste', host: 'Gastgeber' }
  };
  const t = translations[language];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition flex flex-col h-full">
      <img 
        src={room.imageUrl} 
        alt={room.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900 leading-tight">{room.title}</h3>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-semibold shrink-0">
            {room.city}
          </span>
        </div>
        
        {room.ownerName && (
          <p className="text-xs text-gray-400 mb-2">
            {t.host}: <span className="font-medium text-gray-600">{room.ownerName}</span>
          </p>
        )}

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{room.description}</p>
        
        <div className="mt-auto">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span className="mr-4">Max {room.maxGuests} {t.guests}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-gray-900">€{room.pricePerNight}</span>
              <span className="text-gray-500 text-sm ml-1">{t.perNight}</span>
            </div>
            <Link 
              to={`/room/${room.id}`}
              className="text-[#0071c2] font-semibold text-sm hover:underline"
            >
              {t.viewDetails} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
