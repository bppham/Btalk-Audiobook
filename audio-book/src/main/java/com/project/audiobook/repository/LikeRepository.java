package com.project.audiobook.repository;

import com.project.audiobook.entity.AudioBook;
import com.project.audiobook.entity.Like;
import com.project.audiobook.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserAndAudioBook(User user, AudioBook audioBook);
    Optional<Like> deleteByUserAndAudioBook(User user, AudioBook audioBook);
    long countByAudioBook(AudioBook audioBook);
    boolean existsByUserAndAudioBook(User user, AudioBook audioBook);
    boolean existsByUserIdAndAudioBookId(Long userId, Long audioBookId);
    // 👇 Thêm số lượng audiobook user đã like
    long countByUser(User user);
    // 👇 Lấy danh sách audiobook mà user đã like
    @Query("SELECT l.audioBook FROM Like l WHERE l.user = :user")
    List<AudioBook> findLikedAudioBooksByUser(@Param("user") User user);
}
