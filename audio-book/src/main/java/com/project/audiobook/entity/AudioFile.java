package com.project.audiobook.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "audio_files")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AudioFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "NVARCHAR(255)")
    private String fileName;

    @Column(nullable = false, columnDefinition = "NVARCHAR(255)")
    private String fileUrl;

    @ManyToOne
    @JoinColumn(name = "audio_book_id", nullable = false)
    private AudioBook audioBook;
}
