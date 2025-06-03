package com.project.audiobook.repository;

import com.project.audiobook.entity.AudioBook;
import com.project.audiobook.entity.Like;
import com.project.audiobook.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserAndAudioBook(User user, AudioBook audioBook);
    Optional<Like> deleteByUserAndAudioBook(User user, AudioBook audioBook);
    long countByAudioBook(AudioBook audioBook);
    boolean existsByUserAndAudioBook(User user, AudioBook audioBook);
    boolean existsByUserIdAndAudioBookId(Long userId, Long audioBookId);

}
