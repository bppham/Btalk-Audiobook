package com.project.audiobook.repository;

import com.project.audiobook.entity.AudioBook;
import com.project.audiobook.entity.Library;
import com.project.audiobook.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LibraryRepositry extends JpaRepository<Library, Long> {
    Optional<Library> findByUserAndAudioBook(User user, AudioBook audioBook);
    List<Library> findAllByUser(User user);
    boolean existsByUserAndAudioBook(User user, AudioBook audioBook);
    boolean existsByUserIdAndAudioBookId(Long userId, Long audioBookId);
    void deleteByUserAndAudioBook(User user, AudioBook audioBook);
}
