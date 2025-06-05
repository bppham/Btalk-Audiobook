package com.project.audiobook.service;

import com.project.audiobook.dto.response.Audiobook.AudioBookResponse;
import com.project.audiobook.entity.AudioBook;
import com.project.audiobook.mapper.AudioBookMapper;
import com.project.audiobook.repository.AudioBookRepository;
import com.project.audiobook.repository.AudioBookStatRepository;
import com.project.audiobook.utils.AudiobookUtil;
import com.project.audiobook.utils.StatType;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = false)
public class RankingService {
    final AudioBookStatRepository audioBookStatRepository;
    final AudioBookRepository audioBookRepository;
    final AudioBookMapper audioBookMapper;
    final AudiobookUtil audiobookUtil;

    public Page<AudioBookResponse> getTopByDay(LocalDate date, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "listenCount"));
        return audioBookStatRepository.findByTypeAndDateKey(StatType.DAILY, date, pageable)
                .map(stat -> {
                    AudioBookResponse response = audioBookMapper.toAudioBookResponse(stat.getAudioBook());
                    return audiobookUtil.enrichAudioBookResponse(response, stat.getAudioBook());
                });
    }

    public Page<AudioBookResponse> getTopByMonth(YearMonth month, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "listenCount"));
        return audioBookStatRepository.findByTypeAndMonthKey(StatType.MONTHLY, month, pageable)
                .map(stat -> {
                    AudioBookResponse response = audioBookMapper.toAudioBookResponse(stat.getAudioBook());
                    return audiobookUtil.enrichAudioBookResponse(response, stat.getAudioBook());
                });
    }

    public Page<AudioBookResponse> getTopByYear(int year, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "listenCount"));
        return audioBookStatRepository.findByTypeAndYearKey(StatType.YEARLY, year, pageable)
                .map(stat -> {
                    AudioBookResponse response = audioBookMapper.toAudioBookResponse(stat.getAudioBook());
                    return audiobookUtil.enrichAudioBookResponse(response, stat.getAudioBook());
                });
    }

    public Page<AudioBookResponse> getTopByAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return audioBookRepository.findAllByOrderByListenCountDesc(pageable)
                .map(audioBook -> {
                    AudioBookResponse response = audioBookMapper.toAudioBookResponse(audioBook);
                    return audiobookUtil.enrichAudioBookResponse(response, audioBook);
                });
    }

    public Page<AudioBookResponse> getTopByLike(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return audioBookRepository.findTopByLikeCount(pageable)
                .map(audioBook -> {
                    AudioBookResponse response = audioBookMapper.toAudioBookResponse(audioBook);
                    return audiobookUtil.enrichAudioBookResponse(response, audioBook);
                });
    }

    public Page<AudioBookResponse> getTopByRating(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return audioBookRepository.findTopByAverageRating(pageable)
                .map(audioBook -> {
                    AudioBookResponse response = audioBookMapper.toAudioBookResponse(audioBook);
                    return audiobookUtil.enrichAudioBookResponse(response, audioBook);
                });
    }

}
