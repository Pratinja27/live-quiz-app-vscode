package com.livequiz.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Player entity represents a participant in a quiz.
 * Tracks the player's name, current score, and which quiz they joined.
 */
@Entity
@Table(name = "players")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    /**
     * Player's current score — incremented when a correct answer is submitted.
     */
    @Column(nullable = false)
    @Builder.Default
    private Integer score = 0;

    /**
     * The quiz this player has joined.
     */
    @Column(nullable = false)
    private Long quizId;
}
