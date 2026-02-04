package com.booking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.booking.repository")
@EntityScan(basePackages = "com.booking.entity")
public class StayBookingApplication {
    public static void main(String[] args) {
        SpringApplication.run(StayBookingApplication.class, args);
    }
}
