
package com.booking.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "rooms")
@Data
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String city;
    private Double pricePerNight;
    private Integer maxGuests;
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;
}
