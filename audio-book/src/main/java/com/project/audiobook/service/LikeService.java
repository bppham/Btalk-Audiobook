package com.project.audiobook.service;

import com.project.audiobook.dto.request.Like.LikeRequest;
import com.project.audiobook.dto.response.Audiobook.LikeResponse;
import com.project.audiobook.entity.*;
import com.project.audiobook.exception.AppException;
import com.project.audiobook.exception.ErrorCode;
import com.project.audiobook.repository.AudioBookRepository;
import com.project.audiobook.repository.LikeRepository;
import com.project.audiobook.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LikeService {
    LikeRepository likeRepository;
    UserRepository userRepository;
    AudioBookRepository audioBookRepository;

    @Transactional
    public LikeResponse toggleLike(Long userId, LikeRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        AudioBook audioBook = audioBookRepository.findById(request.getAudioBookId())
                .orElseThrow(() -> new AppException(ErrorCode.AUDIOBOOK_NOT_FOUND));

        boolean alreadyLiked = likeRepository.existsByUserAndAudioBook(user, audioBook);

        if (alreadyLiked) {
            Like existingLike = likeRepository.findByUserAndAudioBook(user, audioBook)
                    .orElseThrow(() -> new AppException(ErrorCode.INTERNAL_SERVER_ERROR)); // hoặc LIKE_NOT_FOUND

            likeRepository.delete(existingLike); // 🔥 cần transaction ở đây
        } else {
            Like like = new Like();
            like.setUser(user);
            like.setAudioBook(audioBook);
            like.setLikedAt(LocalDateTime.now());
            likeRepository.save(like);
        }

        long likeCount = likeRepository.countByAudioBook(audioBook);
        boolean likedByCurrentUser = likeRepository.existsByUserAndAudioBook(user, audioBook);

        return new LikeResponse(audioBook.getId(), likeCount, likedByCurrentUser);
    }
}