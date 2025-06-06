package com.project.audiobook.repository;

import com.project.audiobook.entity.AudioBook;
import com.project.audiobook.entity.ListenHistory;
import com.project.audiobook.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ListenHistoryRepository extends JpaRepository<ListenHistory, Long> {
    List<ListenHistory> findByUserOrderByListenedAtDesc(User user);
    Optional<ListenHistory> findByUserAndAudioBook(User user, AudioBook audioBook);
    int countByUser(User user);

    Optional<ListenHistory> findFirstByUserOrderByListenedAtAsc(User user);
}
