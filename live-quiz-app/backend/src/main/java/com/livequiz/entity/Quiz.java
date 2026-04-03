package com.livequiz.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Quiz entity represents a quiz session.
 * A quiz has a title and a lifecycle status: CREATED -> STARTED -> FINISHED.
 */
@Entity
@Table(name = "quizzes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    /**
     * Quiz lifecycle:
     * CREATED  - Quiz is created but not started yet
     * STARTED  - Quiz is live, players can submit answers
     * FINISHED - Quiz has ended, no more submissions allowed
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuizStatus status;

    public enum QuizStatus {
        CREATED, STARTED, FINISHED
    }
}
