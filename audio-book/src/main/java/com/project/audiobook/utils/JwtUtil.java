package com.project.audiobook.utils;

import com.project.audiobook.entity.Employee;
import com.project.audiobook.entity.Role;
import com.project.audiobook.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String SECRET_KEY;

    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 giờ

    private Key getSignKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // 💼 Dành cho nhân viên (admin, audiobook, employee)
    public String generateToken(Employee employee) {
        List<String> roles = employee.getRoles().stream()
                .map(Role::getName)
                .map(role -> "ROLE_" + role)
                .collect(Collectors.toList());

        return buildToken(employee.getEmail(), roles, employee.getId(), employee.getName());
    }

    // 👤 Dành cho người dùng thường
    public String generateTokenForUser(User user) {
        return buildToken(user.getEmail(), new ArrayList<>(), user.getId(), user.getName());
    }

    // 🎯 Build token chung
    private String buildToken(String email, List<String> roles, Long id, String name) {
        return Jwts.builder()
                .setSubject(email)
                .claim("userId", id)
                .claim("name", name)
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    public Long extractUserId(String token) {
        return getClaims(token).get("userId", Long.class);
    }

    public String extractName(String token) {
        return getClaims(token).get("name", String.class);
    }

    public List<String> extractRoles(String token) {
        Object rolesObject = getClaims(token).get("roles");
        if (rolesObject instanceof List<?>) {
            return ((List<?>) rolesObject).stream()
                    .filter(String.class::isInstance)
                    .map(String.class::cast)
                    .collect(Collectors.toList());
        }
        return new ArrayList<>();
    }

    public boolean isTokenValid(String token, String email) {
        return (extractEmail(token).equals(email) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}