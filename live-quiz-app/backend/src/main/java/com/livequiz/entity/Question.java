package com.livequiz.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Question entity stores a quiz question with 4 options and the correct answer.
 * Each question belongs to a specific quiz (identified by quizId).
 */
@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String questionText;

    @Column(nullable = false)
    private String optionA;

    @Column(nullable = false)
    private String optionB;

    @Column(nullable = false)
    private String optionC;

    @Column(nullable = false)
    private String optionD;

    /**
     * Correct answer should be one of: "A", "B", "C", "D"
     */
    @Column(nullable = false)
    private String correctAnswer;

    /**
     * Foreign key linking this question to its quiz.
     */
    @Column(nullable = false)
    private Long quizId;
}
