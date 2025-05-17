package com.project.audiobook.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Entity
@Table(name = "authors")
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, columnDefinition = "NVARCHAR(255)")
    private String name;

    @OneToMany(mappedBy = "author")
    private List<AudioBook> audioBooks;

    @Transient
    private int audioBookCount;

    public int getAudioBookCount() {
        return (audioBooks != null) ? audioBooks.size() : 0;
    }

    public Author(Long id, String name, List<AudioBook> audioBooks) {
        this.id = id;
        this.name = name;
        this.audioBooks = audioBooks;
    }
}
