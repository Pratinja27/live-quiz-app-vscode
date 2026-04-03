package com.livequiz.repository;

import com.livequiz.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * QuizRepository provides CRUD operations for Quiz entity via Spring Data JPA.
 * JpaRepository<Quiz, Long> gives us: save(), findById(), findAll(), deleteById(), etc.
 */
@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
}
