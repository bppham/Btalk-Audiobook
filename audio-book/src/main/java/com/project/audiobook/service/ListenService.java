package com.project.audiobook.service;

import com.project.audiobook.dto.response.Audiobook.HistoryResponse;
import com.project.audiobook.dto.response.Audiobook.ListenCountResponse;
import com.project.audiobook.entity.*;
import com.project.audiobook.exception.AppException;
import com.project.audiobook.exception.ErrorCode;
import com.project.audiobook.mapper.AudioBookMapper;
import com.project.audiobook.mapper.HistoryMapper;
import com.project.audiobook.repository.*;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = false)
public class ListenService {
    final AudioBookRepository audioBookRepository;
    final ListenHistoryRepository listenHistoryRepository;
    final UserRepository userRepository;
    final HistoryMapper historyMapper;

    @Transactional
    public ListenCountResponse increaseListenCount(Long audioBookId) {
        AudioBook audioBook = audioBookRepository.findById(audioBookId)
                .orElseThrow(() -> new AppException(ErrorCode.AUDIOBOOK_NOT_FOUND));
        audioBook.setListenCount(audioBook.getListenCount() + 1);
        AudioBook updated = audioBookRepository.save(audioBook);
        return new ListenCountResponse(audioBookId, updated.getListenCount());
    }

    @Transactional
    public void saveListeningHistory(Long audioBookId, Long userId) {
        AudioBook audioBook = audioBookRepository.findById(audioBookId)
                .orElseThrow(() -> new AppException(ErrorCode.AUDIOBOOK_NOT_FOUND));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        int count = listenHistoryRepository.countByUser(user);
        if (count >= 2) {
            listenHistoryRepository.findFirstByUserOrderByListenedAtAsc(user)
                    .ifPresent(listenHistoryRepository::delete);
        }

        ListenHistory history = new ListenHistory();
        history.setUser(user);
        history.setAudioBook(audioBook);
        history.setListenedAt(LocalDateTime.now());
        listenHistoryRepository.save(history);
    }

    @Transactional
    public List<HistoryResponse> getUserListenHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        List<ListenHistory> historyList = listenHistoryRepository.findByUserOrderByListenedAtDesc(user);
        return historyMapper.toHistoryResponseList(historyList);
    }


}
