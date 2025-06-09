package com.project.audiobook.config;

import com.project.audiobook.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;


@Configuration
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/admin/auth/**").permitAll()
                        .requestMatchers("/user/auth/**").permitAll()
                        .requestMatchers("/upload/**").permitAll()
                        .requestMatchers("/employees/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_EMPLOYEE")
                        .requestMatchers(HttpMethod.GET, "/audiobooks/**").permitAll()
                        .requestMatchers("/audiobooks/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_AUDIOBOOK")
                        .requestMatchers(HttpMethod.GET, "/authors/**").permitAll()
                        .requestMatchers("/authors/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_AUDIOBOOK")
                        .requestMatchers(HttpMethod.GET, "/voices/**").permitAll()
                        .requestMatchers("/voices/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_AUDIOBOOK")
                        .requestMatchers(HttpMethod.GET, "/categories/**").permitAll()
                        .requestMatchers("/categories/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_AUDIOBOOK")
                        .requestMatchers("/statistics/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_AUDIOBOOK", "ROLE_EMPLOYEE")
                        .requestMatchers("/files/**").permitAll()
                        .requestMatchers("/likes/**").authenticated()
                        .requestMatchers("/ratings/**").authenticated()
                        .requestMatchers("/listen/**").permitAll()
                        .requestMatchers("/ranking/**").permitAll()
                        .anyRequest().authenticated() // Các endpoint khác cần đăng nhập
                )
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration configuration = new CorsConfiguration();
                    configuration.addAllowedOrigin("http://localhost:5173"); // Chỉ định đúng domain
                    configuration.addAllowedMethod("GET");
                    configuration.addAllowedMethod("POST");
                    configuration.addAllowedMethod("PUT");
                    configuration.addAllowedMethod("DELETE");
                    configuration.addAllowedMethod("OPTIONS");
                    configuration.addAllowedHeader("Authorization");
                    configuration.addAllowedHeader("Content-Type");
                    configuration.setAllowCredentials(true); // Chấp nhận credentials
                    return configuration;
                }))
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Stateless vì dùng JWT
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
