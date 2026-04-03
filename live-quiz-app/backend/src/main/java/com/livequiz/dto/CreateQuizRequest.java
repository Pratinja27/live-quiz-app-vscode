package com.livequiz.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for creating a new quiz.
 * Separates API request data from the entity to keep concerns clean.
 */
@Data
public class CreateQuizRequest {

    @NotBlank(message = "Quiz title cannot be blank")
    private String title;
}
