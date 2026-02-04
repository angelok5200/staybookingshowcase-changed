
package com.booking.controller;

import com.booking.entity.Booking;
import com.booking.entity.User;
import com.booking.service.BookingService;
import com.booking.repository.UserRepository;
import com.booking.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookingController {
    private final BookingService bookingService;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Map<String, Object> payload, Authentication auth) {
        try {
            User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            var room = roomRepository.findById(Long.valueOf(payload.get("roomId").toString())).orElseThrow();
            
            Booking booking = new Booking();
            booking.setUser(user);
            booking.setRoom(room);
            booking.setCheckIn(java.time.LocalDate.parse(payload.get("checkIn").toString()));
            booking.setCheckOut(java.time.LocalDate.parse(payload.get("checkOut").toString()));
            
            long days = ChronoUnit.DAYS.between(booking.getCheckIn(), booking.getCheckOut());
            if (days <= 0) days = 1;
            booking.setTotalPrice(room.getPricePerNight() * days);
            
            return ResponseEntity.ok(mapToResponse(bookingService.createBooking(booking)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my")
    public List<Map<String, Object>> getMyBookings(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return bookingService.getBookingsByUser(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/managed")
    public List<Map<String, Object>> getManagedBookings(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName()).orElseThrow();
        return bookingService.getBookingsByOwner(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<?> confirmBooking(@PathVariable Long id, Authentication auth) {
        try {
            User owner = userRepository.findByEmail(auth.getName()).orElseThrow();
            return ResponseEntity.ok(mapToResponse(bookingService.confirmBooking(id, owner.getId())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectBooking(@PathVariable Long id, Authentication auth) {
        try {
            User owner = userRepository.findByEmail(auth.getName()).orElseThrow();
            return ResponseEntity.ok(mapToResponse(bookingService.rejectBooking(id, owner.getId())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private Map<String, Object> mapToResponse(Booking b) {
        return Map.of(
            "id", b.getId(),
            "roomId", b.getRoom().getId(),
            "roomTitle", b.getRoom().getTitle(),
            "userId", b.getUser().getId(),
            "userName", b.getUser().getName(),
            "userEmail", b.getUser().getEmail(),
            "checkIn", b.getCheckIn().toString(),
            "checkOut", b.getCheckOut().toString(),
            "totalPrice", b.getTotalPrice(),
            "status", b.getStatus().toString()
        );
    }
}
