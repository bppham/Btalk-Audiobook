package com.project.audiobook.utils;

import com.project.audiobook.dto.response.Audiobook.AudioBookResponse;
import com.project.audiobook.dto.response.Audiobook.UserAudioBookResponse;
import com.project.audiobook.entity.AudioBook;
import com.project.audiobook.entity.AudioBookStat;
import com.project.audiobook.entity.Rating;
import com.project.audiobook.repository.AudioBookStatRepository;
import com.project.audiobook.repository.LibraryRepository;
import com.project.audiobook.repository.LikeRepository;
import com.project.audiobook.repository.RatingRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AudiobookUtil {
    private final AudioBookStatRepository audioBookStatRepository;
    private final LikeRepository likeRepository;
    private final RatingRepository ratingRepository;
    private final LibraryRepository libraryRepository;

    public Long updateAndGetStat(AudioBook book, StatType type,
                                 LocalDate day, YearMonth month, Integer year) {

        Optional<AudioBookStat> optionalStat = switch (type) {
            case DAILY -> audioBookStatRepository.findByAudioBookAndTypeAndDateKey(book, type, day);
            case MONTHLY -> audioBookStatRepository.findByAudioBookAndTypeAndMonthKey(book, type, month);
            case YEARLY -> audioBookStatRepository.findByAudioBookAndTypeAndYearKey(book, type, year);
        };

        AudioBookStat stat = optionalStat.orElseGet(() -> {
            AudioBookStat s = new AudioBookStat();
            s.setAudioBook(book);
            s.setType(type);
            s.setDateKey(day);
            s.setMonthKey(month);
            s.setYearKey(year);
            s.setListenCount(0L); // đảm bảo có giá trị khởi tạo
            return s;
        });

        stat.setListenCount(stat.getListenCount() + 1); // 🔥 THÊM DÒNG NÀY để tăng count
        audioBookStatRepository.save(stat);

        return stat.getListenCount();
    }

    public AudioBookResponse enrichAudioBookResponse(AudioBookResponse response, AudioBook audioBook) {
        response.setLikeCount(likeRepository.countByAudioBook(audioBook));
        List<Rating> allRatings = ratingRepository.findAllByAudioBook(audioBook);
        response.setRatingCount(allRatings.size());
        response.setAverageRating(allRatings.stream().mapToDouble(Rating::getValue).average().orElse(0.0));
        // Lấy listenCount theo ngày / tháng / năm
        LocalDate today = LocalDate.now();
        YearMonth thisMonth = YearMonth.now();
        int year = today.getYear();

        response.setDailyListenCount(
                audioBookStatRepository
                        .findByAudioBookAndTypeAndDateKey(audioBook, StatType.DAILY, today)
                        .map(AudioBookStat::getListenCount)
                        .orElse(0L)
        );

        response.setMonthlyListenCount(
                audioBookStatRepository
                        .findByAudioBookAndTypeAndMonthKey(audioBook, StatType.MONTHLY, thisMonth)
                        .map(AudioBookStat::getListenCount)
                        .orElse(0L)
        );

        response.setYearlyListenCount(
                audioBookStatRepository
                        .findByAudioBookAndTypeAndYearKey(audioBook, StatType.YEARLY, year)
                        .map(AudioBookStat::getListenCount)
                        .orElse(0L)
        );

        return response;
    }

    public UserAudioBookResponse enrichUserAudioBookResponse(UserAudioBookResponse response, AudioBook audioBook, Long userId) {
        response.setLikeCount(likeRepository.countByAudioBook(audioBook));
        response.setLikedByCurrentUser(
                userId != null && likeRepository.existsByUserIdAndAudioBookId(userId, audioBook.getId())
        );

        List<Rating> allRatings = ratingRepository.findAllByAudioBook(audioBook);
        response.setRatingCount(allRatings.size());
        response.setAverageRating(allRatings.stream().mapToDouble(Rating::getValue).average().orElse(0.0));

        if (userId != null) {
            ratingRepository.findByUserIdAndAudioBookId(userId, audioBook.getId())
                    .ifPresent(rating -> response.setUserRating(rating.getValue()));
            response.setSavedByCurrentUser(libraryRepository.existsByUserIdAndAudioBookId(userId, audioBook.getId()));
        } else {
            response.setSavedByCurrentUser(false);
            response.setLikedByCurrentUser(false);
            response.setUserRating(null);
        }
        // Lấy listenCount theo ngày / tháng / năm
        LocalDate today = LocalDate.now();
        YearMonth thisMonth = YearMonth.now();
        int year = today.getYear();

        response.setDailyListenCount(
                audioBookStatRepository
                        .findByAudioBookAndTypeAndDateKey(audioBook, StatType.DAILY, today)
                        .map(AudioBookStat::getListenCount)
                        .orElse(0L)
        );

        response.setMonthlyListenCount(
                audioBookStatRepository
                        .findByAudioBookAndTypeAndMonthKey(audioBook, StatType.MONTHLY, thisMonth)
                        .map(AudioBookStat::getListenCount)
                        .orElse(0L)
        );

        response.setYearlyListenCount(
                audioBookStatRepository
                        .findByAudioBookAndTypeAndYearKey(audioBook, StatType.YEARLY, year)
                        .map(AudioBookStat::getListenCount)
                        .orElse(0L)
        );

        return response;
    }
}
