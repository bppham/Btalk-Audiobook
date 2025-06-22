package com.project.audiobook.scheduler;

import com.project.audiobook.repository.BlacklistedTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class BlacklistedTokenCleanupJob {
    private final BlacklistedTokenRepository tokenRepository;

    // Chạy mỗi 30 phút: phút 0 và 30 của mỗi giờ
    @Scheduled(cron = "0 0,30 * * * *")
    @Transactional
    public void deleteExpiredTokens() {
        int deletedCount = tokenRepository.deleteByExpiresAtBefore(LocalDateTime.now());
        System.out.println("🧹 Dọn dẹp " + deletedCount + " token hết hạn lúc " + LocalDateTime.now());
    }
}
