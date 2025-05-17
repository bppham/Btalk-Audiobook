package com.project.audiobook.utils;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
@RequiredArgsConstructor
public class VerifyCodeUtil {

    private final PasswordEncoder passwordEncoder;

    public String generateRawCode() {
        return String.format("%06d", new Random().nextInt(999999)); // vd: 654321
    }

    public String hashCode(String rawCode) {
        return passwordEncoder.encode(rawCode);
    }
}