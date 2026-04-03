package com.livequiz.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * DTO for adding a question to a quiz.
 * Validates that all fields are present and correctAnswer is A/B/C/D.
 */
@Data
public class AddQuestionRequest {

    @NotBlank(message = "Question text cannot be blank")
    private String questionText;

    @NotBlank(message = "Option A cannot be blank")
    private String optionA;

    @NotBlank(message = "Option B cannot be blank")
    private String optionB;

    @NotBlank(message = "Option C cannot be blank")
    private String optionC;

    @NotBlank(message = "Option D cannot be blank")
    private String optionD;

    /**
     * Must be exactly one of: A, B, C, D (case-insensitive stored as uppercase)
     */
    @NotBlank(message = "Correct answer cannot be blank")
    @Pattern(regexp = "^[ABCDabcd]$", message = "Correct answer must be A, B, C, or D")
    private String correctAnswer;
}
