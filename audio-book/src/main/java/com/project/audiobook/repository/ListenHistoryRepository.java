package com.project.audiobook.repository;

import com.project.audiobook.entity.ListenHistory;
import com.project.audiobook.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ListenHistoryRepository extends JpaRepository<ListenHistory, Long> {
    List<ListenHistory> findByUserOrderByListenedAtDesc(User user);

    int countByUser(User user);

    Optional<ListenHistory> findFirstByUserOrderByListenedAtAsc(User user);
}
