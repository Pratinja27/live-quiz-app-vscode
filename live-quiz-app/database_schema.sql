-- ============================================================
-- Live Quiz Application - MySQL Database Schema
-- ============================================================
-- Run this script in MySQL Workbench or CLI to set up the DB.
-- Spring Boot with ddl-auto=update will also create these
-- tables automatically on first run.
-- ============================================================

CREATE DATABASE IF NOT EXISTS live_quiz_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE live_quiz_db;

-- ============================================================
-- Table: quizzes
-- Stores quiz sessions with lifecycle status
-- ============================================================
CREATE TABLE IF NOT EXISTS quizzes (
    id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    title  VARCHAR(255) NOT NULL,
    status ENUM('CREATED', 'STARTED', 'FINISHED') NOT NULL DEFAULT 'CREATED',
    INDEX idx_quiz_status (status)
);

-- ============================================================
-- Table: questions
-- Stores questions linked to a quiz
-- ============================================================
CREATE TABLE IF NOT EXISTS questions (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    question_text   VARCHAR(1000) NOT NULL,
    option_a        VARCHAR(500) NOT NULL,
    option_b        VARCHAR(500) NOT NULL,
    option_c        VARCHAR(500) NOT NULL,
    option_d        VARCHAR(500) NOT NULL,
    correct_answer  VARCHAR(1) NOT NULL,   -- 'A', 'B', 'C', or 'D'
    quiz_id         BIGINT NOT NULL,
    INDEX idx_question_quiz (quiz_id),
    CONSTRAINT fk_question_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- ============================================================
-- Table: players
-- Stores players and their scores for a quiz
-- ============================================================
CREATE TABLE IF NOT EXISTS players (
    id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    name     VARCHAR(100) NOT NULL,
    score    INT NOT NULL DEFAULT 0,
    quiz_id  BIGINT NOT NULL,
    INDEX idx_player_quiz (quiz_id),
    INDEX idx_player_score (quiz_id, score DESC),
    CONSTRAINT fk_player_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);
