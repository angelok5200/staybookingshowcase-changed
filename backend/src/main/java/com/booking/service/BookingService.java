
package com.booking.service;

import com.booking.entity.Booking;
import com.booking.entity.BookingStatus;
import com.booking.repository.BookingRepository;
import com.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    @Transactional
    public Booking createBooking(Booking booking) {
        userRepository.findById(booking.getUser().getId())
            .orElseThrow(() -> new RuntimeException("Account does not exist."));

        if (booking.getCheckIn().isAfter(booking.getCheckOut()) || 
            booking.getCheckIn().isBefore(LocalDate.now())) {
            throw new RuntimeException("Invalid booking dates.");
        }

        // При створенні статус завжди PENDING
        booking.setStatus(BookingStatus.PENDING);
        
        Booking saved = bookingRepository.save(booking);
        
        try {
            notifyOwner(saved);
        } catch (Exception e) {
            System.err.println("Failed to notify owner: " + e.getMessage());
        }
        
        return saved;
    }

    @Transactional
    public Booking confirmBooking(Long bookingId, Long ownerId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow();
        if (!booking.getRoom().getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Only the owner can confirm this booking.");
        }

        if (bookingRepository.existsOverlappingBooking(booking.getRoom().getId(), booking.getCheckIn(), booking.getCheckOut())) {
            throw new RuntimeException("Dates are already taken by another confirmed booking.");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        Booking saved = bookingRepository.save(booking);
        notifyUser(saved, "confirmed");
        return saved;
    }

    @Transactional
    public Booking rejectBooking(Long bookingId, Long ownerId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow();
        if (!booking.getRoom().getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("Only the owner can reject this booking.");
        }

        booking.setStatus(BookingStatus.REJECTED);
        Booking saved = bookingRepository.save(booking);
        notifyUser(saved, "rejected");
        return saved;
    }

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getBookingsByOwner(Long ownerId) {
        return bookingRepository.findByOwnerId(ownerId);
    }

    private void notifyOwner(Booking booking) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(booking.getRoom().getOwner().getEmail());
            message.setSubject("New Booking Request: " + booking.getRoom().getTitle());
            message.setText("Hello " + booking.getRoom().getOwner().getName() + ",\n\n" +
                "You have a new booking request from " + booking.getUser().getName() + ".\n" +
                "Room: " + booking.getRoom().getTitle() + "\n" +
                "Dates: " + booking.getCheckIn() + " to " + booking.getCheckOut() + "\n" +
                "Total: €" + booking.getTotalPrice() + "\n\n" +
                "Please log in to confirm or reject this request.");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to notify owner: " + e.getMessage());
        }
    }

    private void notifyUser(Booking booking, String action) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(booking.getUser().getEmail());
            message.setSubject("Update on your booking for " + booking.getRoom().getTitle());
            message.setText("Dear " + booking.getUser().getName() + ",\n\n" +
                "Your booking request for " + booking.getRoom().getTitle() + " has been " + action.toUpperCase() + " by the host.\n" +
                "Status: " + booking.getStatus() + "\n\n" +
                "Thank you for using StayBooking!");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to notify user: " + e.getMessage());
        }
    }
}
