package com.project.audiobook.repository;

import com.project.audiobook.entity.BlacklistedToken;
import com.project.audiobook.entity.RefreshToken;
import com.project.audiobook.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BlacklistedTokenRepository extends JpaRepository<BlacklistedToken, String> {
    boolean existsByToken(String token);
    void deleteAllByExpiresAtBefore(LocalDateTime time);
}
