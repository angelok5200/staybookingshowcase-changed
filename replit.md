# StayBooking MVP

A vacation rental booking platform with a React frontend and Java Spring Boot backend.

## Overview

This is a booking platform MVP that allows users to:
- Browse available rooms/listings
- Register and login
- Make bookings
- Manage their bookings

## Project Architecture

### Frontend (React + Vite)
- **Port**: 5000
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **Entry Point**: `index.tsx`

Key directories:
- `/components` - Reusable React components
- `/pages` - Page components for routing
- `/services` - API service layer (`api.ts`)

### Backend (Java Spring Boot)
- **Port**: 8080
- **Framework**: Spring Boot 3.2.3
- **Database**: PostgreSQL (Replit-managed)
- **Build Tool**: Maven
- **Entry Point**: `backend/src/main/java/com/booking/StayBookingApplication.java`

Key packages:
- `com.booking.controller` - REST API endpoints
- `com.booking.entity` - JPA entities
- `com.booking.repository` - Data access layer
- `com.booking.service` - Business logic
- `com.booking.config` - Configuration and data initialization

### Database
- PostgreSQL database via Replit
- Connection via environment variables: PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE
- JPA/Hibernate for ORM with auto-schema update

## Running the Project

### Frontend Only
The frontend workflow runs `npm run dev` on port 5000. It has mock data fallback when the backend is unavailable.

### Full Stack
To run with the backend:
1. Navigate to `backend/` directory
2. Run: `mvn spring-boot:run`
3. Backend runs on port 8080

## API Endpoints

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /rooms` - List all rooms
- `GET /rooms/{id}` - Get room details
- `GET /bookings/my` - User's bookings
- `POST /bookings` - Create booking

## Environment Variables

Required for backend:
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` - Database connection
- `JWT_SECRET` - JWT token secret (has default fallback)

Optional:
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD` - Email config

## Recent Changes

- 2026-02-04: Updated database configuration to use Neon PostgreSQL (`DATABASE_URL`).
- 2026-02-04: Added `jakarta.mail` dependencies to fix compilation errors in `BookingService`.
- 2026-02-04: Added `spring-context-support` to `pom.xml` to resolve `JavaMailSender` compilation errors.
