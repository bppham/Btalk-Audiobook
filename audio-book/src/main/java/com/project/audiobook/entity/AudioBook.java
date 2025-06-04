package com.project.audiobook.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "audio_books")
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
public class AudioBook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "NVARCHAR(255)")
    private String title;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private Author author;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String image;

    @ManyToOne
    @JoinColumn(name = "voice_id")
    private Voice voice;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String description;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String note;

    @ManyToMany
    @JoinTable(
            name = "audio_book_category",
            joinColumns = @JoinColumn(name = "audio_book_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<Category> categories;

    @OneToMany(mappedBy = "audioBook", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AudioFile> audioFiles = new ArrayList<>();

    @OneToMany(mappedBy = "audioBook", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Like> likes = new ArrayList<>();

    @OneToMany(mappedBy = "audioBook", cascade = CascadeType.ALL)
    private List<Rating> ratings;

    @OneToMany(mappedBy = "audioBook", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Library> savedByUsers = new ArrayList<>();

    @Column(nullable = false)
    private Long listenCount = 0L;

}
