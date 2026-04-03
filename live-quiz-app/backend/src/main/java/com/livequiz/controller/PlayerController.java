package com.livequiz.controller;

import com.livequiz.dto.*;
import com.livequiz.entity.Player;
import com.livequiz.service.PlayerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * PlayerController exposes REST APIs for player actions in the quiz.
 *
 * Base URL: /api/player
 *
 * Endpoints:
 *   POST  /api/player/join                    - Player joins a quiz
 *   POST  /api/player/submit                  - Player submits an answer
 *   GET   /api/player/{id}/score              - Get player's current score
 *   GET   /api/player/quiz/{quizId}/leaderboard - Get ranked leaderboard
 *   GET   /api/player/quiz/{quizId}           - Get all players in quiz
 */
@RestController
@RequestMapping("/api/player")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PlayerController {

    private final PlayerService playerService;

    /**
     * POST /api/player/join
     * Registers a player in a quiz session.
     * Returns the created Player object including the generated playerId.
     *
     * The frontend must store this playerId to submit future answers.
     */
    @PostMapping("/join")
    public ResponseEntity<ApiResponse<Player>> joinQuiz(@Valid @RequestBody JoinQuizRequest request) {
        Player player = playerService.joinQuiz(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Joined quiz successfully! Your player ID is: " + player.getId(), player));
    }

    /**
     * POST /api/player/submit
     * Submits an answer for a question.
     * Returns whether the answer was correct and the updated score.
     *
     * Score is only updated if the answer is correct (+10 points).
     */
    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<AnswerResultResponse>> submitAnswer(
            @Valid @RequestBody SubmitAnswerRequest request) {

        AnswerResultResponse result = playerService.submitAnswer(request);
        return ResponseEntity.ok(ApiResponse.ok("Answer submitted", result));
    }

    /**
     * GET /api/player/{id}/score
     * Returns a player's current score and details.
     */
    @GetMapping("/{id}/score")
    public ResponseEntity<ApiResponse<Player>> getPlayerScore(@PathVariable Long id) {
        Player player = playerService.getPlayerScore(id);
        return ResponseEntity.ok(ApiResponse.ok("Player score fetched", player));
    }

    /**
     * GET /api/player/quiz/{quizId}/leaderboard
     * Returns the full ranked leaderboard for a quiz.
     * Players are sorted by score descending.
     */
    @GetMapping("/quiz/{quizId}/leaderboard")
    public ResponseEntity<ApiResponse<List<LeaderboardEntry>>> getLeaderboard(@PathVariable Long quizId) {
        List<LeaderboardEntry> leaderboard = playerService.getLeaderboard(quizId);
        return ResponseEntity.ok(ApiResponse.ok("Leaderboard fetched", leaderboard));
    }

    /**
     * GET /api/player/quiz/{quizId}
     * Returns all players who have joined a specific quiz.
     * Used by the host dashboard to see who's in the room.
     */
    @GetMapping("/quiz/{quizId}")
    public ResponseEntity<ApiResponse<List<Player>>> getPlayersInQuiz(@PathVariable Long quizId) {
        List<Player> players = playerService.getPlayersByQuiz(quizId);
        return ResponseEntity.ok(ApiResponse.ok("Players fetched", players));
    }

}
