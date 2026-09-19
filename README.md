# CyberShield AI: Real-Time AI Threat Intelligence & Incident Response Platform

An enterprise-grade, real-time Security Operations Center (SOC) dashboard designed for live threat monitoring, incident management, automated AI phishing email forensics, and interactive AI threat analysis.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-FFD43B?style=for-the-badge&logo=python&logoColor=blue)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

## 🛡️ Overview

**CyberShield AI** simulates a modern Security Operations Center (SOC) environment. It enables security analysts to monitor incoming cyber attacks in real-time, track security incident lifecycles, interact with an AI SOC assistant, and run automated AI-driven forensics on suspicious emails using LLM API microservices.

Built from the ground up to demonstrate full-stack architecture, asynchronous real-time streaming, database management, and AI microservices integration.

---

## ✨ Key Features

* 📊 **Executive SOC Overview Dashboard**: Live visualization of attack metrics, global threat maps, and server health.
* ⚡ **Real-Time Global Threat Feed**: Zero-latency WebSocket streaming (`Socket.io`) pushing live attack alerts directly to the dashboard.
* 🤖 **SOC AI Assistant**: Interactive AI assistant (`/chat`) connected to Groq LLM to assist analysts in understanding attack vectors and mitigation strategies.
* 📧 **AI Phishing Email Analyzer**: A dedicated Python microservice connected to LLM APIs (`llama-3.3-70b-versatile`) performing forensic threat analysis on suspicious emails.
* 📈 **Advanced Analytics**: Detailed breakdown of threat severity, MITRE ATT&CK framework mapping, and historical attack trends.
* 📋 **Incident Management Workflow**: Full CRUD operations to convert live threats into official managed incidents with status tracking (`Open` → `Investigating` → `Resolved`) and timestamped notes in MongoDB.
* 🔐 **JWT Security & Role-Based Access Control**: Secure login/registration with `bcrypt` password encryption, token verification middleware, and role separation (`admin` / `user`).
* 📄 **CSV Report Export**: Built-in capability to filter threat feeds and export reports to CSV format.

---

## 🛠️ Technology Stack

* **Frontend**: React.js, TypeScript, Vite, Tailwind CSS, Lucide Icons, Socket.io-client
* **Backend**: Node.js, Express.js, MongoDB & Mongoose, Socket.io, JWT Authentication
* **AI Microservice**: Python, Flask, Groq LLM API (`llama-3.3-70b-versatile`)
* **DevOps**: Docker & Docker Compose

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Maliniuppalapati/CyberShield-AI.git
cd CyberShield-AI
```

### 2. Run Locally

**Start the Node.js Backend Server**
```bash
cd server
npm install
npm run dev
```

**Start the Python AI Engine**
```bash
cd ai-engine
pip install -r requirements.txt
python app.py
```

**Start the React Frontend**
```bash
cd client
npm install
npm run dev
```

Access the dashboard at `http://localhost:5173` or `http://localhost:8080`.

---

## 👤 Author

* **Geya Malini Uppalapati** - [GitHub](https://github.com/Maliniuppalapati)
