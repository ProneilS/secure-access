# 🔐 Secure Access System

### Intelligent Authentication with AI Anomaly Detection

A full-stack security system that combines backend authentication, session management, and machine learning to detect suspicious login behavior in real time.

---

## 🚀 Overview

SecureAccess simulates a real-world identity and access management (IAM) system with AI-powered anomaly detection.

It integrates:

* 🔑 JWT-based authentication (access + refresh tokens)
* 🧠 Machine learning (Isolation Forest) for anomaly detection
* 📊 Real-time admin dashboard for monitoring login activity
* ⚙️ Microservice architecture (Node.js + Python)

---

## 🧱 System Architecture

```text
React Dashboard (Vercel)
        ↓
Node.js API (Render) → PostgreSQL
        ↓
Python ML Service (Render)
```

---

## 🔥 Key Features

### 🔐 Authentication & Security

* User registration with hashed passwords (bcrypt)
* Login with JWT access (15 min) + refresh tokens (7 days)
* Role-based access control (RBAC)
* Secure session storage in PostgreSQL

---

### 📊 Login Monitoring

* Every login is logged with:

  * IP address
  * Device (user agent)
  * Timestamp
* Suspicious logins automatically flagged

---

### 🤖 AI Anomaly Detection

* Python Flask microservice using Isolation Forest
* Detects anomalies based on:

  * Login time
  * IP changes
  * Device changes
  * Login frequency
* Non-blocking integration (does not delay login)

---

### 🖥️ Admin Dashboard

* Secure login (no hardcoded tokens)
* View:

  * Total users
  * Total logins
  * Flagged anomalies
* Real-time login event table
* Highlighted suspicious activity (flagged rows)
* Active session tracking

---

## 🧪 Demo Flow

1. Login as admin
2. View dashboard stats and login events
3. Trigger a suspicious login (odd hour / new device)
4. Watch it get flagged in real-time

---

## 🛠️ Tech Stack

| Layer      | Technology                  |
| ---------- | --------------------------- |
| Backend    | Node.js, Express            |
| Database   | PostgreSQL                  |
| Auth       | JWT, bcrypt                 |
| ML Service | Python, Flask, scikit-learn |
| Frontend   | React, Axios                |
| Deployment | Render, Vercel              |

---

## ⚙️ How to Run Locally

### 1️⃣ Backend (Node)

```bash
cd secure-access
npm install
node index.js
```

---

### 2️⃣ Python Anomaly Service

```bash
cd anomaly-service
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

---

### 3️⃣ React Dashboard

```bash
cd dashboard
npm install
npm start
```

---

## 🔐 Environment Variables (.env)

```env
PORT=3000

DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=secure_access

JWT_SECRET=your_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

---

## ⚠️ Known Limitations

* Training data is synthetic (not real user behavior)
* Global ML model (not per-user)
* Model retrains on every startup (not persisted)

### 💡 Production Improvements

* Use real historical login data
* Store known IP/device per user
* Serialize model using `joblib`
* Add refresh token rotation
* Implement OAuth (Google login)

---

## 📸 Screenshots

> Add screenshots here:

* Dashboard overview
* Login events (flagged rows)
* Stats cards

---

## 🎯 Why This Project Matters

This project demonstrates:

* Backend engineering (auth, sessions, RBAC)
* System design (microservices, async processing)
* Security thinking (token lifecycle, logging)
* ML integration into production systems

---

## 📂 GitHub

👉 https://github.com/ProneilS/secure-access

---

## 🚀 Future Improvements

* OAuth 2.0 (Google login)
* Per-user anomaly models
* Refresh token rotation
* Rate limiting & security hardening

---

## 👨‍💻 Author

Built by Proneil Sengupta

---
