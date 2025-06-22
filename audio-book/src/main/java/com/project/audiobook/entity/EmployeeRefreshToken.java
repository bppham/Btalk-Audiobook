package com.project.audiobook.entity;

import com.project.audiobook.enums.DeviceType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "employee_refresh_tokens")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeRefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeviceType deviceType;

    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private LocalDateTime savedAt = LocalDateTime.now();
}
