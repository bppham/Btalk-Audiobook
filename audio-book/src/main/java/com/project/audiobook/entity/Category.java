package com.project.audiobook.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, columnDefinition = "NVARCHAR(255)")
    private String name;

    @ManyToMany(mappedBy = "categories")
    private List<AudioBook> audioBooks = new ArrayList<>();

    @Transient
    private int audioBookCount;

    public int getAudioBookCount() {
        return (audioBooks != null) ? audioBooks.size() : 0;
    }

    public Category(Long id, String name, List<AudioBook> audioBooks) {
        this.id = id;
        this.name = name;
        this.audioBooks = audioBooks;
    }

}
