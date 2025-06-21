package com.project.audiobook.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "blacklisted_tokens")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BlacklistedToken {
    @Id
    private String token;
    private LocalDateTime expiresAt;
}
