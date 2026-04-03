package com.livequiz.controller;

import com.livequiz.dto.AddQuestionRequest;
import com.livequiz.dto.ApiResponse;
import com.livequiz.entity.Question;
import com.livequiz.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * QuestionController exposes REST APIs for managing quiz questions.
 *
 * Base URL: /api/question
 *
 * Endpoints:
 *   POST  /api/question/quiz/{quizId}          - Add a question to a quiz
 *   GET   /api/question/quiz/{quizId}          - Get all questions of a quiz
 *   GET   /api/question/quiz/{quizId}/random   - Get a random question
 *   GET   /api/question/{id}                   - Get question by ID
 */
@RestController
@RequestMapping("/api/question")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QuestionController {

    private final QuestionService questionService;

    /**
     * POST /api/question/quiz/{quizId}
     * Adds a new question to the specified quiz.
     */
    @PostMapping("/quiz/{quizId}")
    public ResponseEntity<ApiResponse<Question>> addQuestion(
            @PathVariable Long quizId,
            @Valid @RequestBody AddQuestionRequest request) {

        Question question = questionService.addQuestion(quizId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Question added successfully", question));
    }

    /**
     * GET /api/question/quiz/{quizId}
     * Returns all questions belonging to a quiz.
     */
    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<ApiResponse<List<Question>>> getQuestions(@PathVariable Long quizId) {
        List<Question> questions = questionService.getQuestionsByQuizId(quizId);
        return ResponseEntity.ok(ApiResponse.ok("Questions fetched successfully", questions));
    }

    /**
     * GET /api/question/quiz/{quizId}/random
     * Returns one randomly selected question from the quiz.
     * Used during active gameplay to serve questions to players.
     */
    @GetMapping("/quiz/{quizId}/random")
    public ResponseEntity<ApiResponse<Question>> getRandomQuestion(@PathVariable Long quizId) {
        Question question = questionService.getRandomQuestion(quizId);
        return ResponseEntity.ok(ApiResponse.ok("Random question fetched", question));
    }

    /**
     * GET /api/question/{id}
     * Returns a specific question by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Question>> getQuestionById(@PathVariable Long id) {
        Question question = questionService.getQuestionById(id);
        return ResponseEntity.ok(ApiResponse.ok("Question fetched successfully", question));
    }

}
