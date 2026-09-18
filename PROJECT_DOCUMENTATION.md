# CyberShield SOC Dashboard: Complete Project Documentation

## 1. Introduction: What is CyberShield?
CyberShield is a **full-stack, real-time Security Operations Center (SOC) dashboard**. 

In the real world, large companies have teams of cybersecurity analysts who sit in a room (the SOC) and monitor incoming network attacks. CyberShield is a web application designed to be exactly the tool those analysts would use on their monitors. It allows them to watch simulated network attacks happen in real-time on a global map, track the most dangerous threats, analyze phishing emails using Artificial Intelligence, and document their investigations.

This project was built to demonstrate advanced full-stack development, real-time asynchronous communication, and modern AI integration.

---

## 2. Core Architecture
The project is built using a modern **3-Tier Microservice Architecture**:

### Tier 1: The Frontend (Client)
* **Technology:** React.js, TypeScript, Tailwind CSS, Vite.
* **Purpose:** This is the visual dashboard the user interacts with. It maintains a constant WebSocket connection to the server so that whenever an attack happens, it instantly draws a dot on the global map and adds a row to the Threat Feed without the user ever having to refresh the page.

### Tier 2: The Backend (Server)
* **Technology:** Node.js, Express.js, MongoDB (Mongoose), Socket.io.
* **Purpose:** The central nervous system of the app. It handles user authentication (login/passwords), generates the simulated cyber attacks every 6 seconds, pushes them to the frontend via WebSockets, and permanently saves all "Incidents" and user notes into a cloud MongoDB database.

### Tier 3: The AI Engine (Microservice)
* **Technology:** Python, Flask, Groq API (llama-3.3-70b-versatile).
* **Purpose:** A separate, highly specialized service running Python. It acts as an "AI Co-Worker". When the React frontend asks for help analyzing an email or answering a security question, the Node server passes the request to this Python engine. The Python engine connects to the incredibly fast Groq LLM to perform complex natural language processing and returns the result.

---

## 3. Deep Dive into Key Features

### Feature 1: Real-Time Global Threat Map & WebSocket Feed
Instead of typical websites where you have to click a button to load data, CyberShield uses **WebSockets (`Socket.io`)**. The backend automatically creates a simulated cyber attack (e.g., a DDoS attack from China to the USA) every few seconds. It pushes this directly to the React frontend. The frontend instantly animates a pulse on the global map and updates the "Total Threats" counter. If the attack is a "Critical" severity (Level 9 or 10), a red "Toast" notification instantly pops up on the screen.

### Feature 2: Incident Management Workflow (CRUD Operations)
When a cybersecurity analyst sees a dangerous threat on the feed, they need to investigate it. 
1. **Promote:** The user can click the three dots next to a threat and click "Promote to Incident". This takes the live, temporary threat and permanently saves it into the MongoDB database as an "Incident".
2. **Update & Track:** The user navigates to the *Incidents* page. Here, they can change the status of the incident (e.g., changing it from "Open" to "Investigating"). They can also type in notes (e.g., "I am blocking this IP address").
3. **Real-time Filtering:** The dashboard features clickable stat cards at the top. Clicking "Investigating" instantly filters the list to only show incidents being worked on.

### Feature 3: Enterprise CSV Data Export
In a real enterprise, managers need reports. On both the Threat Feed and Incidents page, there is an "Export CSV" button. When clicked, the React application takes all the currently filtered data on the screen, converts it into raw comma-separated values, and forces the browser to download an Excel-compatible `.csv` file directly to the user's computer.

### Feature 4: AI Phishing Email Analyzer
Phishing (scam) emails are the #1 cause of company hacks. The dashboard includes an *Email Analyzer* tab. 
* The user pastes the raw text of a suspicious email into the box.
* The text is sent to the Python AI Engine.
* The AI engine is specifically prompt-engineered to act as a "Tier 3 SOC Analyst". It reads the email and returns a highly structured JSON response including:
  * A confidence score (0-100%).
  * A boolean `isPhishing` flag.
  * A list of specific manipulation tactics used in the email (e.g., "Urgency", "Spoofed Sender").
* The React frontend then beautifully displays this analysis.

### Feature 5: SOC Assistant Chatbot
The user has access to a built-in AI chatbot. However, this isn't a standard ChatGPT clone. The Python backend enforces a strict "System Prompt" that forces the AI to **only** talk about cybersecurity. If the user asks for a cake recipe, the AI will refuse to answer. If the user asks how to mitigate a SQL Injection attack, the AI provides expert-level instructions.

---

## 4. How the Data Flows (A Step-by-Step Example)
*Imagine you are logging into the system:*
1. You type in your email and password. React sends this to the Node.js `/api/auth/login` route.
2. Node checks your password against the encrypted version in **MongoDB**. If it matches, it gives you a **JSON Web Token (JWT)**.
3. React saves this JWT and connects to the **Socket.io** server.
4. The Node server's `socketManager.js` wakes up and starts generating fake attacks, pushing them down the WebSocket connection to your browser.
5. You see an attack and promote it. React sends a `POST /api/incidents` request with your JWT to prove you are logged in.
6. Node saves the new Incident to MongoDB.
7. You decide to ask the Chatbot a question. React sends the text to Node -> Node forwards it to `http://localhost:5001/chat` -> Python receives it -> Python asks the **Groq AI model** -> Python gets the answer -> sends it back to Node -> sends it back to React.

---

## 5. Security & Best Practices Implemented
* **Authentication:** Uses secure JWTs (JSON Web Tokens) attached to the `Authorization: Bearer` headers of all API requests. Middleware in Node verifies this token before allowing database access.
* **Environment Variables:** All passwords, API keys (like the Groq API key), and database connection strings are hidden in `.env` files which are blocked from being uploaded to GitHub using a `.gitignore` file.
* **Component-Based UI:** The React frontend is highly modular, re-using components like buttons, cards, and navigation bars to keep the codebase clean and maintainable.
* **Containerization:** The entire system includes a `docker-compose.yml` file, allowing anyone to spin up the React server, Node server, and Python server with a single command. 

## Conclusion
CyberShield is a massive, multi-language application. It proves that the developer understands how to make a beautiful user interface (React), how to handle persistent data and APIs (Node/MongoDB), and how to integrate cutting-edge modern technology (Python/Groq AI).
