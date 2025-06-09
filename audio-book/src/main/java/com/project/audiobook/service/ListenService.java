package com.project.audiobook.service;

import com.project.audiobook.dto.response.Audiobook.HistoryResponse;
import com.project.audiobook.dto.response.Audiobook.ListenCountResponse;
import com.project.audiobook.entity.*;
import com.project.audiobook.exception.AppException;
import com.project.audiobook.exception.ErrorCode;
import com.project.audiobook.mapper.HistoryMapper;
import com.project.audiobook.repository.*;
import com.project.audiobook.utils.AudiobookUtil;
import com.project.audiobook.enums.StatType;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.YearMonth;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = false)
public class ListenService {
    final AudioBookRepository audioBookRepository;
    final ListenHistoryRepository listenHistoryRepository;
    final UserRepository userRepository;
    final HistoryMapper historyMapper;
    final AudioBookStatRepository audioBookStatRepository;
    private final AudiobookUtil listenUtil;

    @Transactional
    public ListenCountResponse increaseListenCount(Long audioBookId) {
        AudioBook audioBook = audioBookRepository.findById(audioBookId)
                .orElseThrow(() -> new AppException(ErrorCode.AUDIOBOOK_NOT_FOUND));

        // Tăng tổng
        audioBook.setListenCount(audioBook.getListenCount() + 1);
        audioBookRepository.save(audioBook);

        // Ngày hiện tại
        LocalDate today = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(today);
        int currentYear = today.getYear();

        // Tăng thống kê + lấy lại listenCount tương ứng
        Long dayCount = listenUtil.updateAndGetStat(audioBook, StatType.DAILY, today, null, null);
        Long monthCount = listenUtil.updateAndGetStat(audioBook, StatType.MONTHLY, null, currentMonth, null);
        Long yearCount = listenUtil.updateAndGetStat(audioBook, StatType.YEARLY, null, null, currentYear);

        return new ListenCountResponse(
                audioBookId,
                audioBook.getListenCount(),
                dayCount,
                monthCount,
                yearCount
        );
    }

    @Transactional
    public void saveListeningHistory(Long audioBookId, Long userId) {
        AudioBook audioBook = audioBookRepository.findById(audioBookId)
                .orElseThrow(() -> new AppException(ErrorCode.AUDIOBOOK_NOT_FOUND));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Xóa lịch sử cũ nếu đã nghe audiobook này
        listenHistoryRepository.findByUserAndAudioBook(user, audioBook)
                .ifPresent(listenHistoryRepository::delete);

        // Nếu đã đủ 10 lịch sử, xóa bản cũ nhất (trừ khi vừa xóa ở trên rồi còn < 10)
        int count = listenHistoryRepository.countByUser(user);
        if (count >= 10) {
            listenHistoryRepository.findFirstByUserOrderByListenedAtAsc(user)
                    .ifPresent(listenHistoryRepository::delete);
        }

        // Tạo bản ghi mới và lưu
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

    public long getTotalListenCountThisYear() {
        int currentYear = Year.now().getValue();
        List<AudioBookStat> stats = audioBookStatRepository.findAllByTypeAndYearKey(StatType.YEARLY, currentYear);
        return stats.stream()
                .mapToLong(AudioBookStat::getListenCount)
                .sum();
    }

    public Map<Integer, Long> getMonthlyListenStatsThisYear() {
        int currentYear = Year.now().getValue();
        YearMonth start = YearMonth.of(currentYear, 1);
        YearMonth end = YearMonth.of(currentYear, 12);

        List<AudioBookStat> stats = audioBookStatRepository
                .findAllByTypeAndMonthKeyBetween(StatType.MONTHLY, start, end);

        Map<Integer, Long> monthlyStats = new LinkedHashMap<>();
        for (int month = 1; month <= 12; month++) {
            monthlyStats.put(month, 0L);
        }

        stats.forEach(stat -> {
            int month = stat.getMonthKey().getMonthValue();
            monthlyStats.merge(month, stat.getListenCount(), Long::sum);
        });

        return monthlyStats;
    }


}
