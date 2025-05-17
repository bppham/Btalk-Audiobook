package com.project.audiobook.repository;

import com.project.audiobook.entity.AudioBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AudioBookRepository extends JpaRepository<AudioBook, Long> {
    boolean existsByTitle(String name);
}
