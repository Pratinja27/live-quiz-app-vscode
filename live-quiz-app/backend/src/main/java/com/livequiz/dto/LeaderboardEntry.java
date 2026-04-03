package com.livequiz.dto;

import lombok.*;

/**
 * Single entry in the leaderboard showing a player's rank, name, and score.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LeaderboardEntry {
    private int rank;           // Position (1st, 2nd, 3rd...)
    private Long playerId;
    private String playerName;
    private int score;
}
