package com.project.audiobook.service;

import com.project.audiobook.dto.request.Rating.RatingRequest;
import com.project.audiobook.dto.response.Audiobook.RatingResponse;
import com.project.audiobook.entity.AudioBook;
import com.project.audiobook.entity.Rating;
import com.project.audiobook.entity.User;
import com.project.audiobook.exception.AppException;
import com.project.audiobook.exception.ErrorCode;

import com.project.audiobook.repository.AudioBookRepository;
import com.project.audiobook.repository.RatingRepository;
import com.project.audiobook.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RatingSerivce {
    RatingRepository ratingRepository;
    UserRepository userRepository;
    AudioBookRepository audioBookRepository;

    @Transactional
    public RatingResponse rateAudioBook(Long userId, RatingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        AudioBook audioBook = audioBookRepository.findById(request.getAudioBookId())
                .orElseThrow(() -> new AppException(ErrorCode.AUDIOBOOK_NOT_FOUND));
        if (request.getValue() > 5 || request.getValue() < 0 ) {
            throw new AppException(ErrorCode.RATING_VALUE_INVALID);
        }


        // Kiểm tra nếu user đã từng đánh giá rồi => update
        Optional<Rating> existingRating = ratingRepository.findByUserAndAudioBook(user, audioBook);
        Rating rating = existingRating.orElse(new Rating());
        rating.setUser(user);
        rating.setAudioBook(audioBook);
        rating.setValue(request.getValue());
        rating.setRatedAt(LocalDateTime.now());
        ratingRepository.save(rating);

        // Tính lại trung bình
        List<Rating> allRatings = ratingRepository.findAllByAudioBook(audioBook);
        double avg = allRatings.stream()
                .mapToDouble(Rating::getValue)
                .average()
                .orElse(0.0);

        return new RatingResponse(
                audioBook.getId(),
                avg,
                allRatings.size(),
                request.getValue()
        );
    }
}