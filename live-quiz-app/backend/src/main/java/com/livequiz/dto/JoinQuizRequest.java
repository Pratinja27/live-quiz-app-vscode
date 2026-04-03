package com.livequiz.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO for a player joining a quiz session.
 */
@Data
public class JoinQuizRequest {

    @NotBlank(message = "Player name cannot be blank")
    private String name;

    @NotNull(message = "Quiz ID cannot be null")
    private Long quizId;
}
