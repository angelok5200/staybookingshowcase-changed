
package com.booking.controller;

import com.booking.entity.Room;
import com.booking.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RoomController {
    private final RoomRepository roomRepository;

    @GetMapping
    public List<Object> getRooms(
            @RequestParam(required = false) String city,
            @RequestParam(required = false, defaultValue = "1") Integer guests,
            @RequestParam(required = false) String checkIn,
            @RequestParam(required = false) String checkOut) {
        
        List<Room> rooms;
        if (checkIn != null && checkOut != null) {
            rooms = roomRepository.findAvailableRooms(city, guests, 
                    LocalDate.parse(checkIn), LocalDate.parse(checkOut));
        } else {
            rooms = roomRepository.findAll();
        }

        return rooms.stream().map(this::mapRoomToResponse).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getRoom(@PathVariable Long id) {
        Room room = roomRepository.findById(id).orElseThrow();
        return ResponseEntity.ok(mapRoomToResponse(room));
    }

    private Map<String, Object> mapRoomToResponse(Room r) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", r.getId());
        map.put("title", r.getTitle());
        map.put("description", r.getDescription());
        map.put("city", r.getCity());
        map.put("pricePerNight", r.getPricePerNight());
        map.put("maxGuests", r.getMaxGuests());
        map.put("imageUrl", r.getImageUrl());
        map.put("ownerName", r.getOwner().getName());
        return map;
    }
}
