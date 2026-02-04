
package com.booking.config;

import com.booking.entity.Room;
import com.booking.entity.User;
import com.booking.repository.RoomRepository;
import com.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Створюємо тестового власника
            User owner = new User();
            owner.setName("John Host");
            owner.setEmail("host@example.com");
            owner.setPassword(passwordEncoder.encode("password123"));
            userRepository.save(owner);

            // Додаємо кілька кімнат
            Room room1 = new Room();
            room1.setTitle("Luxury Beachfront Apartment");
            room1.setDescription("Stunning view of the ocean with all modern amenities.");
            room1.setCity("Nice");
            room1.setPricePerNight(120.0);
            room1.setMaxGuests(4);
            room1.setImageUrl("https://picsum.photos/seed/room1/1200/800");
            room1.setOwner(owner);
            roomRepository.save(room1);

            Room room2 = new Room();
            room2.setTitle("Modern City Loft");
            room2.setDescription("Located in the heart of Berlin, perfect for business trips.");
            room2.setCity("Berlin");
            room2.setPricePerNight(85.0);
            room2.setMaxGuests(2);
            room2.setImageUrl("https://picsum.photos/seed/room2/1200/800");
            room2.setOwner(owner);
            roomRepository.save(room2);
            
            System.out.println("SQL Database initialized with seed data.");
        }
    }
}
