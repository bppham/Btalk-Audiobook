package com.project.audiobook.repository;

import com.project.audiobook.entity.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


public interface AuthorRepository extends JpaRepository<Author, Long> {
    boolean existsByName(String name);
}
