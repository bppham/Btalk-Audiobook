package com.project.audiobook.utils;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

@Component
public class JwtRequestUtil {
    private final JwtUtil jwtUtil;

    public JwtRequestUtil(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    public Long getUserIdFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractUserId(token);
        }
        throw new RuntimeException("Missing or invalid Authorization header");
    }
}
