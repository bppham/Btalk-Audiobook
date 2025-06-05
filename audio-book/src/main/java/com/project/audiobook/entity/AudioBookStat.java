package com.project.audiobook.entity;

import com.project.audiobook.utils.StatType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;

@Entity
@Table(name = "audiobook_stats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AudioBookStat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "audio_book_id")
    private AudioBook audioBook;

    @Enumerated(EnumType.STRING)
    private StatType type; // DAILY, MONTHLY, YEARLY

    @Column
    private LocalDate dateKey;

    @Column
    private YearMonth monthKey;

    @Column
    private Integer yearKey;

    @Column(nullable = false)
    private Long listenCount = 0L;
}
