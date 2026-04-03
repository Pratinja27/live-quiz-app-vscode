package com.livequiz.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * DTO for submitting an answer to a question.
 * The player submits their chosen option (A/B/C/D) for a specific question.
 */
@Data
public class SubmitAnswerRequest {

    @NotNull(message = "Player ID cannot be null")
    private Long playerId;

    @NotNull(message = "Question ID cannot be null")
    private Long questionId;

    /**
     * The answer the player chose: A, B, C, or D
     */
    @NotBlank(message = "Selected option cannot be blank")
    @Pattern(regexp = "^[ABCDabcd]$", message = "Answer must be A, B, C, or D")
    private String selectedOption;
}
