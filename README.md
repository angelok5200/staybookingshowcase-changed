
# StayBooking MVP

A full-stack booking application similar to Booking.com, designed as a portfolio project.

## Tech Stack
- **Frontend**: React (TypeScript, Tailwind CSS)
- **Backend**: Spring Boot 3 (Java 17)
- **Database**: H2 (Development) / PostgreSQL (Production ready)
- **Auth**: JWT (Stateless)
- **Email**: JavaMailSender (SMTP)

## Features
- User registration and login
- Multilingual UI (English / German)
- Room search by city and guests
- Detailed room pages with reviews
- Booking management with overlap validation
- Automatic email confirmation upon booking

## How to Run Backend
1. Navigate to `/backend`.
2. Configure your SMTP settings in `application.properties` or set environment variables.
3. Run with Maven: `./mvnw spring-boot:run`.
4. API available at `http://localhost:8080`.

## How to Run Frontend
1. Navigate to `/frontend` (or root in this sandbox context).
2. Install dependencies: `npm install`.
3. Start dev server: `npm start`.
4. Access at `http://localhost:3000`.

## Test User Credentials
- Any registration works (uses mock storage in sandbox UI).
- Default demo user: `john@example.com` / `password123`.

## API Overview
- `POST /auth/register`: Create a new user.
- `POST /auth/login`: Get JWT token.
- `GET /rooms`: List rooms (with optional filters).
- `POST /bookings`: Create a booking (Auth required).
- `GET /bookings/my`: List user bookings (Auth required).
