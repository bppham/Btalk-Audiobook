package com.project.audiobook.repository;

import com.project.audiobook.entity.AudioBook;
import com.project.audiobook.entity.AudioBookStat;
import com.project.audiobook.enums.StatType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Optional;

@Repository
public interface AudioBookStatRepository extends JpaRepository<AudioBookStat, Long> {
    Optional<AudioBookStat> findByAudioBookAndTypeAndDateKey(AudioBook book, StatType type, LocalDate date);
    Optional<AudioBookStat> findByAudioBookAndTypeAndMonthKey(AudioBook book, StatType type, YearMonth month);
    Optional<AudioBookStat> findByAudioBookAndTypeAndYearKey(AudioBook book, StatType type, Integer year);

    Page<AudioBookStat> findByTypeAndDateKey(StatType type, LocalDate dateKey, Pageable pageable);

    Page<AudioBookStat> findByTypeAndMonthKey(StatType type, YearMonth monthKey, Pageable pageable);

    Page<AudioBookStat> findByTypeAndYearKey(StatType type, Integer yearKey, Pageable pageable);

    void deleteByTypeAndDateKeyBefore(StatType type, LocalDate date);
    void deleteByTypeAndMonthKeyBefore(StatType type, YearMonth month);
    void deleteByTypeAndYearKeyLessThan(StatType type, int year);
}
