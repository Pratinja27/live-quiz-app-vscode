package com.livequiz.repository;

import com.livequiz.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * QuestionRepository handles database operations for Question entity.
 * Includes custom queries for fetching questions by quiz and random selection.
 */
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    /**
     * Retrieve all questions belonging to a specific quiz.
     */
    List<Question> findByQuizId(Long quizId);

    /**
     * Count how many questions exist for a quiz.
     */
    long countByQuizId(Long quizId);

    /**
     * Fetch one random question from a quiz using native MySQL RAND() function.
     * LIMIT 1 ensures only a single random result is returned.
     */
    @Query(value = "SELECT * FROM questions WHERE quiz_id = :quizId ORDER BY RAND() LIMIT 1",
           nativeQuery = true)
    Optional<Question> findRandomQuestionByQuizId(@Param("quizId") Long quizId);
    void deleteByQuizId(Long quizId);
}
