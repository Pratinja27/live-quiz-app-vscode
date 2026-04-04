package com.livequiz.controller;

import com.livequiz.dto.ApiResponse;
import com.livequiz.dto.CreateQuizRequest;
import com.livequiz.entity.Quiz;
import com.livequiz.service.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * QuizController exposes REST APIs for quiz lifecycle management.
 *
 * Base URL: /api/quiz
 *
 * Endpoints:
 *   POST   /api/quiz          - Create a new quiz
 *   POST   /api/quiz/{id}/start - Start a quiz
 *   POST   /api/quiz/{id}/end   - End a quiz
 *   GET    /api/quiz/{id}       - Get quiz details
 *   GET    /api/quiz            - Get all quizzes
 */
@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow React frontend on any port
public class QuizController {

    private final QuizService quizService;

    /**
     * POST /api/quiz
     * Creates a new quiz with CREATED status.
     *
     * Request Body: { "title": "My Quiz" }
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Quiz>> createQuiz(@Valid @RequestBody CreateQuizRequest request) {
        Quiz quiz = quizService.createQuiz(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Quiz created successfully", quiz));
    }

    /**
     * POST /api/quiz/{id}/start
     * Transitions quiz from CREATED -> STARTED.
     */
    @PostMapping("/{id}/start")
    public ResponseEntity<ApiResponse<Quiz>> startQuiz(@PathVariable Long id) {
        Quiz quiz = quizService.startQuiz(id);
        return ResponseEntity.ok(ApiResponse.ok("Quiz started successfully", quiz));
    }

    /**
     * POST /api/quiz/{id}/end
     * Transitions quiz from STARTED -> FINISHED.
     */
    @PostMapping("/{id}/end")
    public ResponseEntity<ApiResponse<Quiz>> endQuiz(@PathVariable Long id) {
        Quiz quiz = quizService.endQuiz(id);
        return ResponseEntity.ok(ApiResponse.ok("Quiz ended successfully", quiz));
    }

    /**
     * GET /api/quiz/{id}
     * Returns details of a specific quiz.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Quiz>> getQuiz(@PathVariable Long id) {
        Quiz quiz = quizService.getQuizById(id);
        return ResponseEntity.ok(ApiResponse.ok("Quiz fetched successfully", quiz));
    }

    /**
     * GET /api/quiz
     * Returns all quizzes.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Quiz>>> getAllQuizzes() {
        List<Quiz> quizzes = quizService.getAllQuizzes();
        return ResponseEntity.ok(ApiResponse.ok("All quizzes fetched", quizzes));
    }

    /**
     * POST /api/quiz/{id}/reset
     * Resets a FINISHED quiz back to CREATED.
     * Wipes old players/scores but keeps all questions.
     */
    @PostMapping("/{id}/reset")
    public ResponseEntity<ApiResponse<Quiz>> resetQuiz(@PathVariable Long id) {
        Quiz quiz = quizService.resetQuiz(id);
        return ResponseEntity.ok(ApiResponse.ok("Quiz reset! Ready to play again.", quiz));
    }

    /**
     * Global exception handler for this controller.
     * Returns a clean error message when a RuntimeException or IllegalStateException is thrown.
     */
    /**
     * DELETE /api/quiz/{id}
     * Deletes quiz + all its questions + all its players.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.ok(ApiResponse.ok("Quiz deleted successfully.", null));
    }

    /**
     * POST /api/quiz/login
     * Simple host login — checks hardcoded credentials.
     * Returns success true/false. No JWT needed.
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> hostLogin(@RequestBody java.util.Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        if ("admin".equals(username) && "host123".equals(password)) {
            return ResponseEntity.ok(ApiResponse.ok("Login successful", "authenticated"));
        }
        return ResponseEntity.status(401).body(ApiResponse.error("Invalid username or password"));
    }

    
}
