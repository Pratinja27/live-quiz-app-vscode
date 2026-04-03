package com.livequiz;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Live Quiz Spring Boot Application.
 * @SpringBootApplication enables auto-configuration, component scan, and configuration.
 */
@SpringBootApplication
public class LiveQuizApplication {
    public static void main(String[] args) {
        SpringApplication.run(LiveQuizApplication.class, args);
    }
}
