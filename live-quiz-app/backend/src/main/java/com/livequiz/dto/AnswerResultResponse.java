package com.livequiz.dto;

import lombok.*;

/**
 * Response DTO returned after a player submits an answer.
 * Tells the player if they were correct and shows updated score.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AnswerResultResponse {
    private boolean correct;           // Was the submitted answer correct?
    private String correctAnswer;      // The actual correct answer (A/B/C/D)
    private int updatedScore;          // Player's new total score
    private String message;            // Human-readable feedback message
}
