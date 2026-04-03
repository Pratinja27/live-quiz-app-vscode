package com.livequiz.service;

import com.livequiz.dto.*;
import com.livequiz.entity.Player;
import com.livequiz.entity.Question;
import com.livequiz.entity.Quiz;
import com.livequiz.repository.PlayerRepository;
import com.livequiz.repository.QuestionRepository;
import com.livequiz.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * PlayerService handles all player-related business logic:
 * - Joining a quiz
 * - Submitting answers with score calculation
 * - Fetching leaderboard
 */
@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;

    /** Score awarded for each correct answer */
    private static final int POINTS_PER_CORRECT_ANSWER = 10;

    /**
     * Allows a player to join a quiz.
     * Validates that the quiz exists and is in STARTED status (or CREATED for pre-join).
     * A new Player record is created with score = 0.
     *
     * @throws RuntimeException if quiz not found
     * @throws IllegalStateException if quiz is already FINISHED
     */
    public Player joinQuiz(JoinQuizRequest request) {
        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found with ID: " + request.getQuizId()));

        if (quiz.getStatus() == Quiz.QuizStatus.FINISHED) {
            throw new IllegalStateException("Cannot join a quiz that has already finished.");
        }

        Player player = Player.builder()
                .name(request.getName())
                .score(0)          // All players start at 0
                .quizId(request.getQuizId())
                .build();

        return playerRepository.save(player);
    }

    /**
     * Processes a player's answer submission.
     *
     * Logic:
     * 1. Verify the player exists
     * 2. Fetch the question
     * 3. Verify the quiz is in STARTED status (no submissions allowed otherwise)
     * 4. Compare submitted answer to correct answer (case-insensitive)
     * 5. If correct: add POINTS_PER_CORRECT_ANSWER to player's score
     * 6. Return result with updated score
     */
    public AnswerResultResponse submitAnswer(SubmitAnswerRequest request) {
        // Fetch the player
        Player player = playerRepository.findById(request.getPlayerId())
                .orElseThrow(() -> new RuntimeException("Player not found with ID: " + request.getPlayerId()));

        // Fetch the question
        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found with ID: " + request.getQuestionId()));

        // Verify the quiz is currently active
        Quiz quiz = quizRepository.findById(player.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        if (quiz.getStatus() != Quiz.QuizStatus.STARTED) {
            throw new IllegalStateException("Quiz is not currently active. Status: " + quiz.getStatus());
        }

        // Check if the submitted answer matches the correct answer (case-insensitive)
        boolean isCorrect = question.getCorrectAnswer()
                .equalsIgnoreCase(request.getSelectedOption());

        // Update score if correct
        if (isCorrect) {
            player.setScore(player.getScore() + POINTS_PER_CORRECT_ANSWER);
            playerRepository.save(player);
        }

        // Build and return the result response
        return AnswerResultResponse.builder()
                .correct(isCorrect)
                .correctAnswer(question.getCorrectAnswer())
                .updatedScore(player.getScore())
                .message(isCorrect
                        ? "Correct! You earned " + POINTS_PER_CORRECT_ANSWER + " points."
                        : "Wrong! The correct answer was: " + question.getCorrectAnswer())
                .build();
    }

    /**
     * Returns the current score of a specific player.
     */
    public Player getPlayerScore(Long playerId) {
        return playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Player not found with ID: " + playerId));
    }

    /**
     * Builds a ranked leaderboard for a quiz.
     * Players are sorted by score (descending) — already handled by the repository query.
     * Assigns sequential rank numbers (1st, 2nd, 3rd...).
     */
    public List<LeaderboardEntry> getLeaderboard(Long quizId) {
        List<Player> players = playerRepository.findByQuizIdOrderByScoreDesc(quizId);

        List<LeaderboardEntry> leaderboard = new ArrayList<>();
        int rank = 1;

        for (Player player : players) {
            leaderboard.add(LeaderboardEntry.builder()
                    .rank(rank++)
                    .playerId(player.getId())
                    .playerName(player.getName())
                    .score(player.getScore())
                    .build());
        }

        return leaderboard;
    }

    /**
     * Returns all players who have joined a specific quiz.
     */
    public List<Player> getPlayersByQuiz(Long quizId) {
        return playerRepository.findByQuizId(quizId);
    }
}
