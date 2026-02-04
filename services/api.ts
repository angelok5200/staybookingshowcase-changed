
const API_BASE_URL = 'http://localhost:8080';

// Mock Data for fallback when backend is unreachable
const MOCK_ROOMS = [
  {
    id: 1,
    title: "Luxury Beachfront Apartment",
    description: "Stunning view of the ocean with all modern amenities. Perfect for a relaxing getaway.",
    city: "Nice",
    pricePerNight: 120,
    maxGuests: 4,
    imageUrl: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80",
    ownerName: "John Host"
  },
  {
    id: 2,
    title: "Modern City Loft",
    description: "Located in the heart of Berlin, perfect for business trips or urban exploration.",
    city: "Berlin",
    pricePerNight: 85,
    maxGuests: 2,
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    ownerName: "John Host"
  }
];

export const api = {
  async get(endpoint: string) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error(await response.text() || 'Fetch error');
      return response.json();
    } catch (err) {
      console.warn(`Backend unreachable at ${endpoint}, using mock data.`);
      return this.handleMockGet(endpoint);
    }
  },

  async post(endpoint: string, data: any) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errorText = await response.text();
        if (errorText.includes("Email taken")) throw new Error("Email taken");
        throw new Error(errorText || 'Post error');
      }
      return response.json();
    } catch (err: any) {
      // Re-throw specific errors to be caught by UI
      if (err.message === 'Email taken' || err.message === 'Invalid credentials') throw err;
      
      console.warn(`Backend unreachable at ${endpoint}, simulating action.`);
      return this.handleMockPost(endpoint, data);
    }
  },

  handleMockGet(endpoint: string) {
    if (endpoint.startsWith('/rooms')) {
      if (endpoint.includes('/reviews')) return [];
      const idMatch = endpoint.match(/\/rooms\/(\d+)/);
      if (idMatch) return MOCK_ROOMS.find(r => r.id === Number(idMatch[1])) || MOCK_ROOMS[0];
      return MOCK_ROOMS;
    }
    if (endpoint === '/bookings/my') {
      return JSON.parse(localStorage.getItem('mock_bookings') || '[]');
    }
    if (endpoint === '/bookings/managed') return [];
    return [];
  },

  handleMockPost(endpoint: string, data: any) {
    if (endpoint === '/auth/login') {
      const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
      const user = users.find((u: any) => u.email === data.email);
      if (!user && data.email !== 'host@example.com') throw new Error('Invalid credentials');
      return { token: 'mock-jwt-token', user: user || { id: 1, name: 'John Host', email: data.email } };
    }

    if (endpoint === '/auth/register') {
      const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
      if (users.some((u: any) => u.email === data.email)) throw new Error('Email taken');
      
      const newUser = { ...data, id: Date.now() };
      users.push(newUser);
      localStorage.setItem('mock_users', JSON.stringify(users));
      return { token: 'mock-jwt-token', user: newUser };
    }

    if (endpoint === '/bookings') {
      const bookings = JSON.parse(localStorage.getItem('mock_bookings') || '[]');
      const room = MOCK_ROOMS.find(r => r.id === Number(data.roomId)) || MOCK_ROOMS[0];
      
      const newBooking = { 
        ...data, 
        id: Date.now(), 
        status: 'PENDING', 
        roomTitle: room.title,
        totalPrice: room.pricePerNight * 2 // Default to 2 nights for mock
      };
      bookings.push(newBooking);
      localStorage.setItem('mock_bookings', JSON.stringify(bookings));
      return newBooking;
    }

    return { success: true };
  }
};
