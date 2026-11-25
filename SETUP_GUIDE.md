# 🛠️ Complete Setup Guide — Live Quiz App

This guide walks you through **every single step** from zero to a running app.

---

## STEP 1 — Install Prerequisites

### Java 17
Download from: https://adoptium.net/temurin/releases/?version=17

Verify install:
```bash
java -version
# Should show: openjdk version "17.x.x"
```

### Maven (optional — project includes mvnw wrapper)
Download from: https://maven.apache.org/download.cgi
Or use the included `./mvnw` script instead of `mvn`.

### MySQL 8.0
Download from: https://dev.mysql.com/downloads/mysql/

**Quick setup after install:**
```sql
-- Open MySQL CLI or MySQL Workbench and run:
CREATE DATABASE live_quiz_db;

-- Verify:
SHOW DATABASES;
-- You should see live_quiz_db in the list
```

### Node.js 18+ (for frontend)
Download from: https://nodejs.org/en/download

Verify:
```bash
node -v   # Should show v18.x.x or higher
npm -v    # Should show 8.x.x or higher
```

---

## STEP 2 — Set Up the Backend

### 2a. Open the project in IntelliJ IDEA (recommended)
1. Open IntelliJ IDEA
2. File → Open → select the `backend/` folder
3. IntelliJ will detect the `pom.xml` and import Maven dependencies automatically
4. Wait for indexing to complete (bottom status bar)

### OR open in VS Code
1. Install extension: "Extension Pack for Java" (Microsoft)
2. File → Open Folder → select `backend/`

### 2b. Configure database credentials
Open: `backend/src/main/resources/application.properties`

Change these two lines:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_ACTUAL_MYSQL_PASSWORD
```

If your MySQL runs on a different port or host, also update:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/live_quiz_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
```

### 2c. Run the backend

**Option A — IntelliJ IDEA:**
1. Open `LiveQuizApplication.java`
2. Click the green ▶ button next to `public static void main`
3. Or use the pre-configured Run Config: Run → Run 'LiveQuizApplication'

**Option B — Terminal (Maven Wrapper, no Maven install needed):**
```bash
cd backend

# Linux/Mac:
chmod +x mvnw
./mvnw spring-boot:run

# Windows:
mvnw.cmd spring-boot:run
```

**Option C — Terminal (if Maven is installed globally):**
```bash
cd backend
mvn spring-boot:run
```

**Option D — Build JAR and run:**
```bash
cd backend
./mvnw clean package -DskipTests
java -jar target/live-quiz-backend-1.0.0.jar
```

### ✅ Verify backend is running:
Open browser or Postman:
```
GET http://localhost:8080/api/quiz
```
Expected response:
```json
{ "success": true, "message": "All quizzes fetched", "data": [] }
```

---

## STEP 3 — What Happens on First Run

When the backend starts for the first time:
1. Spring Boot connects to MySQL using your credentials
2. Hibernate reads all `@Entity` classes
3. Because `ddl-auto=update`, Hibernate **automatically creates** the tables:
   - `quizzes`
   - `questions`
   - `players`
4. No manual SQL needed! (But `database_schema.sql` is included for reference)

You can verify in MySQL:
```sql
USE live_quiz_db;
SHOW TABLES;
-- Should show: quizzes, questions, players
```

---

## STEP 4 — Set Up the Frontend

```bash
cd frontend

# Install all npm dependencies (only needed once)
npm install

# Start the React development server
npm start
```

The browser will open automatically at: **http://localhost:3000**

The React app is pre-configured to call the backend at `http://localhost:8080/api`.

---

## STEP 5 — Play the Quiz!

### As the Host:
1. Go to `http://localhost:3000`
2. Type a quiz title → Click **Create Quiz**
3. You land on the **Host Dashboard**
4. Add at least 3–5 questions (select the correct answer A/B/C/D for each)
5. **Share the Quiz ID** (shown on the dashboard) with your players
6. Once players join, click **▶ Start Quiz**
7. When done, click **⏹ End Quiz** → leaderboard appears

### As a Player:
1. Go to `http://localhost:3000`
2. Enter the Quiz ID from the host → Click **Join Quiz**
3. Enter your name → Click **Join & Play!**
4. Wait for the host to start — you'll see "Waiting for host..."
5. Questions appear with a **15-second countdown**
6. Click your answer then **Submit**
7. See if you got it right + your updated score
8. Final leaderboard shows when host ends the quiz

---

## Troubleshooting

### ❌ "Access denied for user 'root'@'localhost'"
→ Wrong MySQL password in `application.properties`. Double-check it.

### ❌ "Communications link failure" / "Connection refused"
→ MySQL is not running. Start it:
- Windows: Services → MySQL80 → Start
- Mac: System Preferences → MySQL → Start
- Linux: `sudo systemctl start mysql`

### ❌ Port 8080 already in use
→ Change port in `application.properties`:
```properties
server.port=8081
```
Then also update `frontend/src/services/api.js`:
```js
const BASE_URL = 'http://localhost:8081/api';
```

### ❌ CORS error in browser console
→ The backend's `CorsConfig.java` allows all origins (`*`).
   Make sure the backend is actually running on port 8080.

### ❌ npm install fails
→ Delete `node_modules/` and `package-lock.json`, then re-run `npm install`.

### ❌ "Table 'live_quiz_db.quizzes' doesn't exist"
→ The DB was created but tables weren't. Set `spring.jpa.hibernate.ddl-auto=create` temporarily,
   run once, then change back to `update`.

---

## Project Structure Quick Reference

```
backend/
├── mvnw                  ← Run backend on Mac/Linux (no Maven needed)
├── mvnw.cmd              ← Run backend on Windows
├── pom.xml               ← All dependencies (Spring Boot, JPA, MySQL, Lombok)
├── .mvn/wrapper/         ← Maven wrapper config
└── src/
    ├── main/
    │   ├── java/com/livequiz/
    │   │   ├── LiveQuizApplication.java   ← MAIN CLASS — run this
    │   │   ├── entity/                    ← Database tables
    │   │   ├── repository/                ← DB queries
    │   │   ├── service/                   ← Business logic
    │   │   ├── controller/                ← REST API endpoints
    │   │   ├── dto/                       ← Request/response shapes
    │   │   └── config/                    ← CORS + error handling
    │   └── resources/
    │       └── application.properties     ← DB config ← EDIT THIS
    └── test/
        ├── java/.../LiveQuizApplicationTests.java
        └── resources/application-test.properties  ← H2 in-memory for tests

frontend/
├── package.json          ← npm dependencies
└── src/
    ├── App.js            ← Routes
    ├── App.css           ← All styles
    ├── services/api.js   ← All API calls ← change BASE_URL here if needed
    ├── pages/            ← All page components
    └── components/       ← Shared components (Navbar)
```
