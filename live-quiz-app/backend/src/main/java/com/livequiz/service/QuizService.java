package com.livequiz.service;

import com.livequiz.dto.CreateQuizRequest;
import com.livequiz.entity.Quiz;
import com.livequiz.repository.QuizRepository;
import com.livequiz.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * QuizService contains all business logic related to quiz lifecycle management.
 * - Create quiz
 * - Start quiz (CREATED -> STARTED)
 * - End quiz (STARTED -> FINISHED)
 * - Fetch quiz details
 */
@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final PlayerRepository playerRepository; 
    /**
     * Creates a new quiz with CREATED status.
     * The quiz is not yet visible to players until it is started.
     */
    public Quiz createQuiz(CreateQuizRequest request) {
        Quiz quiz = Quiz.builder()
                .title(request.getTitle())
                .status(Quiz.QuizStatus.CREATED)
                .build();
        return quizRepository.save(quiz);
    }

    /**
     * Transitions a quiz from CREATED to STARTED.
     * Only CREATED quizzes can be started.
     *
     * @throws IllegalStateException if quiz is not in CREATED status
     */
    public Quiz startQuiz(Long quizId) {
        Quiz quiz = getQuizById(quizId);

        if (quiz.getStatus() != Quiz.QuizStatus.CREATED) {
            throw new IllegalStateException(
                "Quiz can only be started when in CREATED status. Current status: " + quiz.getStatus()
            );
        }

        quiz.setStatus(Quiz.QuizStatus.STARTED);
        return quizRepository.save(quiz);
    }

    /**
     * Transitions a quiz from STARTED to FINISHED.
     * Only STARTED quizzes can be finished.
     *
     * @throws IllegalStateException if quiz is not in STARTED status
     */
    public Quiz endQuiz(Long quizId) {
        Quiz quiz = getQuizById(quizId);

        if (quiz.getStatus() != Quiz.QuizStatus.STARTED) {
            throw new IllegalStateException(
                "Quiz can only be ended when in STARTED status. Current status: " + quiz.getStatus()
            );
        }

        quiz.setStatus(Quiz.QuizStatus.FINISHED);
        return quizRepository.save(quiz);
    }

    /**
     * Fetches quiz by ID. Throws RuntimeException if not found.
     */
    public Quiz getQuizById(Long quizId) {
        return quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with ID: " + quizId));
    }


    /**
     * Returns all quizzes in the system.
     */
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public Quiz resetQuiz(Long quizId) {
        Quiz quiz = getQuizById(quizId);

        if (quiz.getStatus() != Quiz.QuizStatus.FINISHED) {
            throw new IllegalStateException(
                "Only FINISHED quizzes can be reset. Current status: " + quiz.getStatus()
            );
        }
        playerRepository.deleteByQuizId(quizId);  // ← wipe old players
        quiz.setStatus(Quiz.QuizStatus.CREATED);
        return quizRepository.save(quiz);
    }
}