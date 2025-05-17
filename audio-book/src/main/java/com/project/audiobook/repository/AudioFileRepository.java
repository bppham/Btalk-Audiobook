package com.project.audiobook.repository;

import com.project.audiobook.entity.AudioFile;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AudioFileRepository extends JpaRepository<AudioFile, Long> {
    @Modifying
    @Transactional
    @Query("DELETE FROM AudioFile af WHERE af.audioBook.id = :audioBookId")
    void deleteByAudioBookId(@Param("audioBookId") Long audioBookId);
}
