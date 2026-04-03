# Live Quiz App — Postman API Testing Guide

Base URL: `http://localhost:8080/api`

---

## 1. QUIZ APIs

### Create Quiz
**POST** `/api/quiz`
```json
{
  "title": "General Knowledge Quiz"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Quiz created successfully",
  "data": { "id": 1, "title": "General Knowledge Quiz", "status": "CREATED" }
}
```

---

### Start Quiz
**POST** `/api/quiz/1/start`
*(No request body)*

---

### End Quiz
**POST** `/api/quiz/1/end`
*(No request body)*

---

### Get Quiz Details
**GET** `/api/quiz/1`

---

### Get All Quizzes
**GET** `/api/quiz`

---

## 2. QUESTION APIs

### Add Question to Quiz
**POST** `/api/question/quiz/1`
```json
{
  "questionText": "What is the capital of France?",
  "optionA": "Berlin",
  "optionB": "Madrid",
  "optionC": "Paris",
  "optionD": "Rome",
  "correctAnswer": "C"
}
```

### Add Another Question
```json
{
  "questionText": "Which planet is known as the Red Planet?",
  "optionA": "Earth",
  "optionB": "Mars",
  "optionC": "Jupiter",
  "optionD": "Saturn",
  "correctAnswer": "B"
}
```

---

### Get All Questions in Quiz
**GET** `/api/question/quiz/1`

---

### Get Random Question
**GET** `/api/question/quiz/1/random`

---

## 3. PLAYER APIs

### Join Quiz
**POST** `/api/player/join`
```json
{
  "name": "Alice",
  "quizId": 1
}
```
**Response:**
```json
{
  "success": true,
  "message": "Joined quiz successfully! Your player ID is: 1",
  "data": { "id": 1, "name": "Alice", "score": 0, "quizId": 1 }
}
```
> **Important:** Save the `id` from the response — this is your `playerId` for submitting answers.

---

### Submit Answer
**POST** `/api/player/submit`
```json
{
  "playerId": 1,
  "questionId": 1,
  "selectedOption": "C"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Answer submitted",
  "data": {
    "correct": true,
    "correctAnswer": "C",
    "updatedScore": 10,
    "message": "Correct! You earned 10 points."
  }
}
```

---

### Get Player Score
**GET** `/api/player/1/score`

---

### Get Leaderboard
**GET** `/api/player/quiz/1/leaderboard`

**Response:**
```json
{
  "success": true,
  "message": "Leaderboard fetched",
  "data": [
    { "rank": 1, "playerId": 2, "playerName": "Bob", "score": 30 },
    { "rank": 2, "playerId": 1, "playerName": "Alice", "score": 20 },
    { "rank": 3, "playerId": 3, "playerName": "Charlie", "score": 10 }
  ]
}
```

---

### Get Players in Quiz
**GET** `/api/player/quiz/1`

---

## Complete Game Flow

1. **Host** — `POST /api/quiz` → get `quizId`
2. **Host** — `POST /api/question/quiz/{quizId}` × N (add questions)
3. **Players** — `POST /api/player/join` → get `playerId`
4. **Host** — `POST /api/quiz/{quizId}/start`
5. **Players** — `GET /api/question/quiz/{quizId}/random` → get question
6. **Players** — `POST /api/player/submit` → check result
7. **Repeat** steps 5–6 for each question
8. **Host** — `POST /api/quiz/{quizId}/end`
9. **All** — `GET /api/player/quiz/{quizId}/leaderboard` → see rankings
