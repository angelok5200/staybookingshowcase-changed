
package com.booking.repository;

import com.booking.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByCityContainingIgnoreCase(String city);

    @Query("SELECT r FROM Room r WHERE " +
           "(:city IS NULL OR LOWER(r.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "r.maxGuests >= :guests AND " +
           "NOT EXISTS (SELECT b FROM Booking b WHERE b.room = r AND b.status = 'CONFIRMED' AND " +
           "(b.checkIn < :checkOut AND b.checkOut > :checkIn))")
    List<Room> findAvailableRooms(@Param("city") String city, 
                                 @Param("guests") Integer guests, 
                                 @Param("checkIn") LocalDate checkIn, 
                                 @Param("checkOut") LocalDate checkOut);
}
