🔐 SecureAccess
Intelligent Authentication System with AI-Based Anomaly Detection

🚀 Live Demo: https://secure-access-ashy.vercel.app

⚙️ Backend API: https://secure-access-v2ta.onrender.com

🧠 Overview

SecureAccess is a production-deployed, full-stack authentication system designed to simulate modern identity and access management (IAM) architectures.

It goes beyond traditional login systems by integrating a machine learning microservice to detect suspicious login behavior in real time.

Built to explore how real-world authentication systems handle security, scalability, and anomaly detection.

⚡ Key Features
🔐 JWT Authentication (Access + Refresh Tokens)
🛡️ Role-Based Access Control (RBAC)
📊 Login Event Tracking & Session Management
🧠 AI-Based Anomaly Detection (Isolation Forest)
🔄 Non-blocking backend → ML service communication
📈 Admin Dashboard with real-time monitoring
☁️ Fully deployed multi-service architecture
🏗️ System Architecture
          ┌──────────────┐
          │   Frontend   │ (React - Vercel)
          └──────┬───────┘
                 │
                 ▼
        ┌──────────────────┐
        │  Node.js Backend │ (Render)
        │ Auth + Sessions  │
        └──────┬───────────┘
               │
       ┌───────▼────────┐
       │ PostgreSQL DB  │ (Render)
       │ Users / Events │
       └───────┬────────┘
               │
               ▼
      ┌───────────────────┐
      │ Python ML Service │ (Flask - Render)
      │ Isolation Forest  │
      └───────────────────┘
🔄 Authentication Flow
User submits login credentials
Backend validates and compares hashed password (bcrypt)
JWT tokens are generated:
Access Token (15 min)
Refresh Token (7 days)
Login event is stored in database
Backend asynchronously sends data to ML service
ML service evaluates anomaly score
Suspicious logins are flagged in database
Session stored → tokens returned

⚡ Important: Anomaly detection is non-blocking to avoid login delays.

🧠 Anomaly Detection (ML Service)
Model: Isolation Forest (Unsupervised)
Trained on synthetic login behavior data
Features used:
hour_of_day
ip_changed
new_device
login_frequency_today
Why Isolation Forest?
No labeled attack data required
Efficient for anomaly detection
Works well for behavioral deviations
🗄️ Database Design
Tables:
users
sessions
login_events
Key Design Decisions:
ON DELETE CASCADE → prevents orphan records
flagged column → marks anomalous logins
Session storage → enables refresh token revocation
🖥️ Admin Dashboard
📊 Total users, logins, flagged events
🚨 Highlighted suspicious logins
🧾 Active session tracking
🔐 Admin-only access
⚙️ Tech Stack
Layer	Technology
Backend	Node.js, Express
Database	PostgreSQL
Auth	JWT, bcrypt
ML Service	Python, Flask, scikit-learn
Frontend	React
Deployment	Render, Vercel
🚀 Deployment
Frontend: Vercel
Backend + Python Service: Render
Database: Render PostgreSQL

⚠️ Render free tier may sleep after inactivity (30–60s cold start)

🧪 Testing

✔️ Authentication flows (valid/invalid credentials)
✔️ RBAC protection
✔️ Admin endpoints
✔️ Anomaly detection scenarios
✔️ Rapid login attempts
✔️ Deployment behavior (cold starts, logs)

🧯 Challenges & Fixes
1. Python version incompatibility
Issue: Python 3.14 broke dependencies
Fix: Pinned to python-3.11.9
2. Service communication
Issue: http.request complexity
Fix: Switched to Axios for cleaner integration
3. Port binding in deployment
Issue: Flask not exposed
Fix: Bound to 0.0.0.0 with dynamic PORT
4. Route mismatch
Issue: /analyze vs /analyse
Fix: Standardized endpoint naming
5. Missing dependencies crash
Issue: Axios not installed
Fix: Added to package.json
🔐 Security Considerations
Same error message for invalid email/password → prevents user enumeration
Short-lived access tokens → reduces attack window
Refresh tokens stored server-side → revocable
Role-based route protection
⚠️ Limitations
Uses synthetic training data
Global model (not per-user)
Basic IP/device detection heuristics
🚧 Future Improvements
OAuth (Google login)
Per-user anomaly models
Redis for behavioral tracking
Refresh token rotation
Real-world dataset integration
💬 Why This Project?

Modern authentication systems don’t stop at login — they monitor behavior.

This project was built to:

Understand real-world IAM systems
Explore security beyond JWT
Implement behavior-based anomaly detection
Experience production deployment challenges
📌 Author

Proneil Sengupta
Backend & AI Systems Enthusiast

⭐ Final Note

This project focuses on system design, security, and real-world engineering challenges — not just building features.

If you found this interesting, feel free to ⭐ the repo!
