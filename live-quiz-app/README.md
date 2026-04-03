# ⚡ LiveQuiz — Full-Stack Real-Time Quiz Application

A complete full-stack Live Quiz app built with **Java Spring Boot** (backend) and **React.js** (frontend).

---

## 🗂 Project Structure

```
live-quiz-app/
├── backend/                          # Spring Boot Application
│   ├── pom.xml                       # Maven dependencies
│   └── src/main/java/com/livequiz/
│       ├── LiveQuizApplication.java  # Main entry point
│       ├── entity/
│       │   ├── Quiz.java             # Quiz entity (id, title, status)
│       │   ├── Question.java         # Question entity (4 options + answer)
│       │   └── Player.java           # Player entity (name, score, quizId)
│       ├── repository/
│       │   ├── QuizRepository.java
│       │   ├── QuestionRepository.java  # Includes random question query
│       │   └── PlayerRepository.java    # Includes leaderboard query
│       ├── service/
│       │   ├── QuizService.java      # Quiz lifecycle logic
│       │   ├── QuestionService.java  # Question management + random select
│       │   └── PlayerService.java    # Join, submit answer, score, leaderboard
│       ├── controller/
│       │   ├── QuizController.java   # /api/quiz endpoints
│       │   ├── QuestionController.java # /api/question endpoints
│       │   └── PlayerController.java   # /api/player endpoints
│       ├── dto/                      # Request/Response data transfer objects
│       │   ├── ApiResponse.java      # Generic wrapper { success, message, data }
│       │   ├── CreateQuizRequest.java
│       │   ├── AddQuestionRequest.java
│       │   ├── JoinQuizRequest.java
│       │   ├── SubmitAnswerRequest.java
│       │   ├── AnswerResultResponse.java
│       │   └── LeaderboardEntry.java
│       └── config/
│           └── WebConfig.java        # CORS configuration
│
├── frontend/                         # React Application
│   ├── package.json
│   └── src/
│       ├── App.js                    # Router + page layout
│       ├── App.css                   # Global dark theme styles
│       ├── index.js                  # React entry point
│       ├── services/
│       │   └── api.js                # All Axios API calls
│       ├── components/
│       │   └── Navbar.js
│       └── pages/
│           ├── HomePage.js           # Create or join quiz
│           ├── HostDashboard.js      # Manage quiz (add questions, start/end)
│           ├── PlayerPage.js         # Enter name and join
│           ├── QuizScreen.js         # Answer questions with timer
│           └── LeaderboardPage.js    # Final rankings
│
├── database_schema.sql               # MySQL schema
├── POSTMAN_API_EXAMPLES.md           # API testing examples
└── README.md                         # This file
```

---

## ⚙️ Prerequisites

| Tool | Version |
|------|---------|
| Java | 17+ |
| Maven | 3.6+ |
| MySQL | 8.0+ |
| Node.js | 16+ |
| npm | 8+ |

---

## 🗄️ Database Setup

### Option A — Manual SQL
```sql
-- In MySQL CLI or Workbench:
CREATE DATABASE live_quiz_db;
```
Then run the contents of `database_schema.sql`.

### Option B — Let Spring Boot create it automatically
Spring Boot with `ddl-auto=update` will auto-create all tables on first run.
Just make sure the database exists:
```sql
CREATE DATABASE live_quiz_db;
```

---

## 🚀 Running the Backend

### 1. Update database credentials
Open `backend/src/main/resources/application.properties` and set:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/live_quiz_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### 2. Build and Run
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start at: **http://localhost:8080**

### Verify it's running:
```
GET http://localhost:8080/api/quiz
```
Expected response: `{ "success": true, "message": "All quizzes fetched", "data": [] }`

---

## 🌐 Running the Frontend

```bash
cd frontend
npm install
npm start
```

The frontend will start at: **http://localhost:3000**

The React app connects to `http://localhost:8080/api` by default.
To change the backend URL, edit `frontend/src/services/api.js`:
```js
const BASE_URL = 'http://localhost:8080/api';
```

---

## 🎮 How to Play — Step by Step

### As a Host:
1. Go to `http://localhost:3000`
2. Enter a quiz title → Click **Create Quiz**
3. On the Host Dashboard:
   - Add multiple questions with 4 options each
   - Share the **Quiz ID** with players
4. Once players join, click **▶ Start Quiz**
5. Players answer questions in real-time
6. Click **⏹ End Quiz** to finish and view the leaderboard

### As a Player:
1. Go to `http://localhost:3000`
2. Enter the **Quiz ID** → Click **Join Quiz**
3. Enter your name → Click **Join & Play! 🚀**
4. Wait for the host to start the quiz
5. Answer each question within 15 seconds
6. See your score update after each answer
7. View the final leaderboard when quiz ends

---

## 🔌 API Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/quiz` | Create quiz |
| POST | `/api/quiz/{id}/start` | Start quiz |
| POST | `/api/quiz/{id}/end` | End quiz |
| GET | `/api/quiz/{id}` | Get quiz details |
| GET | `/api/quiz` | Get all quizzes |
| POST | `/api/question/quiz/{quizId}` | Add question |
| GET | `/api/question/quiz/{quizId}` | Get all questions |
| GET | `/api/question/quiz/{quizId}/random` | Get random question |
| POST | `/api/player/join` | Join quiz |
| POST | `/api/player/submit` | Submit answer |
| GET | `/api/player/{id}/score` | Get player score |
| GET | `/api/player/quiz/{quizId}/leaderboard` | Get leaderboard |
| GET | `/api/player/quiz/{quizId}` | Get players in quiz |

See `POSTMAN_API_EXAMPLES.md` for full request/response examples.

---

## 🏗️ Key Architecture Decisions

- **DTOs** separate API layer from entities — prevents over-posting and keeps API contracts clean
- **Generic `ApiResponse<T>`** wrapper ensures consistent `{ success, message, data }` format
- **Native query** with MySQL `RAND()` for true random question selection
- **Score calculation** is server-side only — clients cannot manipulate scores
- **CORS configured globally** in `WebConfig.java` to allow React frontend
- **Polling** (every 3–5 seconds) used instead of WebSockets for simplicity
- **Quiz status FSM**: `CREATED → STARTED → FINISHED` (one-way only, enforced in service layer)
