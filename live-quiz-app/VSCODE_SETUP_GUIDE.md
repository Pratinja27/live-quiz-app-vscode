# 🟦 VS Code Setup Guide — Live Quiz App

Everything you need to open, run, and debug this project in **Visual Studio Code**.

---

## STEP 1 — Install VS Code Extensions

When you open this project, VS Code will show a popup:
> *"Do you want to install the recommended extensions for this workspace?"*

**Click "Install All"** — this installs everything automatically.

Or install manually one by one:

### Required for Backend (Java + Spring Boot):
| Extension | Publisher | What it does |
|-----------|-----------|--------------|
| **Extension Pack for Java** | Microsoft | Core Java support, Maven, debugging |
| **Spring Boot Extension Pack** | VMware | Spring Dashboard, live hover info |
| **Spring Boot Dashboard** | Microsoft | Start/stop app from sidebar panel |

### Required for Frontend (React):
| Extension | Publisher | What it does |
|-----------|-----------|--------------|
| **ES7+ React/Redux Snippets** | dsznajder | `rfc` → full component, `useState` shortcuts |
| **ESLint** | Microsoft | Catches JS errors as you type |
| **Prettier** | Prettier | Auto-formats code on save |

### Bonus (highly recommended):
| Extension | What it does |
|-----------|--------------|
| **REST Client** | Test APIs inside VS Code — no Postman needed |
| **MySQL Client** | View your database tables inside VS Code |
| **Material Icon Theme** | Better file icons |

---

## STEP 2 — Open the Project in VS Code

### Option A — Open the Workspace File (BEST way)
Double-click `live-quiz-app.code-workspace`
OR in VS Code: **File → Open Workspace from File → live-quiz-app.code-workspace**

This opens backend and frontend as two separate roots in one window:
```
Explorer sidebar shows:
  🍃 Backend (Spring Boot)
    ├── src/
    ├── pom.xml
    └── ...
  ⚛️ Frontend (React)
    ├── src/
    ├── package.json
    └── ...
```

### Option B — Open the whole folder
File → Open Folder → select `live-quiz-app/`

---

## STEP 3 — Configure Your MySQL Password

Open this file in VS Code:
```
backend/src/main/resources/application.properties
```

Find this line and replace with your actual MySQL password:
```properties
spring.datasource.password=your_password_here
```

> 💡 **Tip:** If you don't have a MySQL password (root with no password), just leave it blank:
> `spring.datasource.password=`

---

## STEP 4 — Install Dependencies

### Backend (do this once):
Open the **integrated terminal** in VS Code: `` Ctrl+` `` (backtick)

```bash
cd backend
./mvnw clean install -DskipTests
```
Windows:
```bash
cd backend
mvnw.cmd clean install -DskipTests
```

This downloads all Java/Spring Boot dependencies from Maven Central.
Takes ~2 minutes first time. You'll see `BUILD SUCCESS` when done.

### Frontend (do this once):
Open a new terminal tab (click the **+** icon in terminal panel):
```bash
cd frontend
npm install
```
This downloads React, Axios, React Router, etc. into `node_modules/`.

---

## STEP 5 — Run the App

### Method A — Spring Boot Dashboard (easiest, no terminal needed)
1. Click the **Spring Boot Dashboard** icon in the left sidebar
   (looks like a leaf 🍃, or find it under the Explorer panel)
2. You'll see **live-quiz-backend** listed
3. Click the **▶ play button** next to it
4. Watch the output panel — when you see `Started LiveQuizApplication`, it's running!

### Method B — Run & Debug Panel (F5)
1. Press `Ctrl+Shift+D` to open Run & Debug
2. Use the dropdown at the top to select a config:
   - `▶ Start Spring Boot Backend` — starts backend only
   - `▶ Start React Frontend` — starts frontend only
   - `🚀 Start Full Stack (Backend + Frontend)` — starts BOTH at once!
3. Press **F5** or click the green ▶ button

### Method C — Terminal
Open two terminal tabs:

**Tab 1 — Backend:**
```bash
cd backend
./mvnw spring-boot:run        # Mac/Linux
mvnw.cmd spring-boot:run      # Windows
```

**Tab 2 — Frontend:**
```bash
cd frontend
npm start
```

---

## STEP 6 — Test the APIs (No Postman Needed!)

Open the file: `.vscode/api-test.http`

You'll see all API requests with a **"Send Request"** link above each one.
Click it → response appears in a split panel on the right.

Example:
```http
POST http://localhost:8080/api/quiz
Content-Type: application/json

{
  "title": "My Test Quiz"
}
```
↑ Click **Send Request** above this → see the JSON response instantly.

> Requires the **REST Client** extension (humao.rest-client)

---

## STEP 7 — View the Database in VS Code

1. Install **MySQL Client** extension (cweijan.vscode-mysql-client2)
2. Click the database icon in the left sidebar
3. Click **+** to add a new connection:
   - Host: `localhost`
   - Port: `3306`
   - Username: `root`
   - Password: your MySQL password
   - Database: `live_quiz_db`
4. Click **Connect**
5. Expand `live_quiz_db` → expand `Tables`
6. Right-click any table → **Select Top 1000 Rows**

---

## Keyboard Shortcuts Cheat Sheet

| Shortcut | Action |
|----------|--------|
| `F5` | Run with debug (uses launch.json) |
| `Ctrl+F5` | Run without debug |
| `Shift+F5` | Stop running app |
| `F9` | Toggle breakpoint on current line |
| `Ctrl+Shift+B` | Run Build Task (starts backend) |
| `Ctrl+Shift+D` | Open Run & Debug panel |
| `Ctrl+Shift+X` | Open Extensions panel |
| `` Ctrl+` `` | Open/close terminal |
| `Ctrl+Shift+P` | Command palette (search any command) |
| `Ctrl+P` | Quick file open |

---

## Setting a Breakpoint (Debug Like a Pro)

1. Open any Java file, e.g. `PlayerService.java`
2. Click in the **gutter** (left of line numbers) next to `submitAnswer()` method
3. A red dot appears — that's your breakpoint
4. Press **F5** to start in debug mode
5. When the code hits that line, VS Code pauses execution
6. You can inspect variable values, step through line by line (F10), etc.

---

## Troubleshooting

### "Java not found" error
→ Install JDK 17: https://adoptium.net/temurin/releases/?version=17
→ Set `JAVA_HOME` environment variable to the JDK folder
→ Restart VS Code after installing

### "Cannot find symbol" / red squiggles everywhere in Java
→ Open Command Palette (`Ctrl+Shift+P`) → type **"Java: Clean Language Server Workspace"** → click it → Reload
→ Wait ~30 seconds for Java extension to re-index

### Spring Boot Dashboard shows no apps
→ Make sure you opened the **backend/** folder or used the workspace file
→ `Ctrl+Shift+P` → **"Spring Boot Dashboard: Refresh"**

### Port 8080 already in use
→ Find what's using it:
   - Windows: `netstat -ano | findstr :8080`
   - Mac/Linux: `lsof -i :8080`
→ Or just change the port in `application.properties`:
  `server.port=8081`

### npm start fails — "react-scripts not found"
→ You forgot to run `npm install` in the `frontend/` folder first

### CORS error in browser
→ Backend must be running on port 8080
→ Check `CorsConfig.java` allows your frontend origin
