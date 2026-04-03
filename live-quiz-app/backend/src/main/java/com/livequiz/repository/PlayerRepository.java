package com.livequiz.repository;

import com.livequiz.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * PlayerRepository handles database operations for Player entity.
 * Provides methods to find players by quiz and build leaderboards.
 */
@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {

    /**
     * Get all players in a quiz, sorted by score descending — used for leaderboard.
     */
    List<Player> findByQuizIdOrderByScoreDesc(Long quizId);

    /**
     * Get all players who joined a specific quiz.
     */
    List<Player> findByQuizId(Long quizId);
}
