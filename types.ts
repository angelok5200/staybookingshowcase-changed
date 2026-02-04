
export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Room {
  id: number;
  title: string;
  description: string;
  city: string;
  pricePerNight: number;
  maxGuests: number;
  imageUrl: string;
  ownerName: string; 
}

export interface Booking {
  id: number;
  roomId: number;
  roomTitle: string;
  userId: number;
  userName?: string;
  userEmail?: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';
}

export interface Review {
  id: number;
  roomId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export enum Language {
  EN = 'en',
  DE = 'de'
}
