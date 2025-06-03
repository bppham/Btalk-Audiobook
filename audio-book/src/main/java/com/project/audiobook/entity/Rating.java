package com.project.audiobook.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "ratings")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private double value; // Giá trị từ 1 đến 5

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "audio_book_id", nullable = false)
    private AudioBook audioBook;

    @Column(name = "rated_at", nullable = false)
    private LocalDateTime ratedAt = LocalDateTime.now();
}
