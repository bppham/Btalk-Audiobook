package com.project.audiobook.repository;

import com.project.audiobook.entity.AudioBook;
import com.project.audiobook.entity.Rating;
import com.project.audiobook.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    // Tìm rating của một user cho một audiobook cụ thể
    Optional<Rating> findByUserAndAudioBook(User user, AudioBook audioBook);
    Optional<Rating> findByUserIdAndAudioBookId(Long userId, Long audioBookId);


    // Đếm tổng số lượt đánh giá cho audiobook
    long countByAudioBook(AudioBook audioBook);

    // Kiểm tra người dùng đã đánh giá audiobook chưa
    boolean existsByUserAndAudioBook(User user, AudioBook audioBook);

    // Lấy tất cả rating của 1 audiobook để tính trung bình
    List<Rating> findAllByAudioBook(AudioBook audioBook);
}
