package com.livequiz.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * CorsConfig - Configures Cross-Origin Resource Sharing (CORS).
 *
 * Why is this needed?
 * Browsers block frontend JavaScript (running on port 3000) from
 * calling a backend on port 8080 unless the backend explicitly allows it.
 *
 * This configuration allows requests from the React dev server (localhost:3000)
 * to reach our Spring Boot backend (localhost:8080).
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Allow React frontend origin
        config.addAllowedOrigin("http://localhost:3000");

        // Allow all HTTP headers (Content-Type, Authorization, etc.)
        config.addAllowedHeader("*");

        // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
        config.addAllowedMethod("*");

        // Allow cookies/credentials if needed in future
        config.setAllowCredentials(true);

        // Apply this CORS config to all API endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);

        return new CorsFilter(source);
    }
}
