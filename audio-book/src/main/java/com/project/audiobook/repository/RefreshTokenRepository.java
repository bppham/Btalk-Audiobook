package com.project.audiobook.repository;

import com.project.audiobook.entity.RefreshToken;
import com.project.audiobook.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository  extends JpaRepository<RefreshToken, String> {
    Optional<RefreshToken> findByToken(String token);
    boolean existsByToken(String token);
    void deleteByToken(String token);
    List<RefreshToken> findAllByUser(User user);
}
