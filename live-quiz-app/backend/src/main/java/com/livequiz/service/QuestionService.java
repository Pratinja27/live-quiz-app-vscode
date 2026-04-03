package com.livequiz.service;

import com.livequiz.dto.AddQuestionRequest;
import com.livequiz.entity.Question;
// import com.livequiz.entity.Quiz;
import com.livequiz.repository.QuestionRepository;
import com.livequiz.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * QuestionService handles adding questions to quizzes and retrieving them.
 * Includes random question selection for quiz gameplay.
 */
@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;

    /**
     * Adds a new question to a quiz.
     * Verifies that the quiz exists before adding the question.
     * The correctAnswer is stored in uppercase for consistent comparison.
     */
    public Question addQuestion(Long quizId, AddQuestionRequest request) {
        // Verify the quiz exists
        quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with ID: " + quizId));

        Question question = Question.builder()
                .questionText(request.getQuestionText())
                .optionA(request.getOptionA())
                .optionB(request.getOptionB())
                .optionC(request.getOptionC())
                .optionD(request.getOptionD())
                .correctAnswer(request.getCorrectAnswer().toUpperCase()) // Normalize to uppercase
                .quizId(quizId)
                .build();

        return questionRepository.save(question);
    }

    /**
     * Retrieves all questions for a given quiz.
     * Note: In production, you may want to hide correctAnswer from players.
     */
    public List<Question> getQuestionsByQuizId(Long quizId) {
        return questionRepository.findByQuizId(quizId);
    }

    /**
     * Fetches one random question from a quiz.
     * Uses MySQL's RAND() function via a native query for true randomness.
     *
     * @throws RuntimeException if no questions exist for the quiz
     */
    public Question getRandomQuestion(Long quizId) {
        return questionRepository.findRandomQuestionByQuizId(quizId)
                .orElseThrow(() -> new RuntimeException("No questions found for quiz ID: " + quizId));
    }

    /**
     * Fetches a specific question by its ID.
     */
    public Question getQuestionById(Long questionId) {
        return questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found with ID: " + questionId));
    }

    /**
     * Returns the total number of questions in a quiz.
     */
    public long countQuestions(Long quizId) {
        return questionRepository.countByQuizId(quizId);
    }
}
