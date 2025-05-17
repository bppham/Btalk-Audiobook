package com.project.audiobook.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173") // Cho phép frontend từ localhost:5173
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Cho phép các method
                .allowedHeaders("*") // Cho phép tất cả các header
                .allowCredentials(true); // Cho phép credentials (cookie, token, v.v.)
    }
}
