# 🔐 SecureAccess

### Intelligent Authentication System with AI-Based Anomaly Detection
🚀 **Interactive Demo (Recommended):** https://secure-access-ui.vercel.app  
📊 **Admin Dashboard:** https://secure-access-ashy.vercel.app    
⚙️ **Backend API:** https://secure-access-v2ta.onrender.com

---

## 🧠 Overview

SecureAccess is a production-deployed authentication system that goes beyond JWT-based login by integrating real-time behavioral anomaly detection.

Instead of trusting every successful login, the system evaluates user behavior (IP, device, time) using a machine learning microservice and flags suspicious activity instantly.

This project simulates how modern identity systems detect compromised accounts — not just authenticate users.

---

## ⚡ Try it in 30 seconds

1. Open the interactive demo  
2. Click any scenario (e.g. 3AM login or Foreign IP)  
3. Watch the system flag anomalies in real time  
4. Open the admin dashboard to see logged events  

> ⚠️ First request may take ~30-60s (Render free tier cold start)

---

## 🔥 What Makes This Different

- 🔐 JWT Authentication (Access + Refresh Tokens)
- 🛡️ Role-Based Access Control (RBAC)
- 📊 Login Event Tracking & Session Management
- 🧠 AI-Based Anomaly Detection (Isolation Forest)
- ⚡ Non-blocking architecture — ML scoring never delays authentication
- 📈 Admin Dashboard with real-time monitoring
- ☁️ Fully deployed multi-service architecture

---

## 🏗️ System Architecture

```
          ┌──────────────┐
          │   Frontend   │  (React - Vercel)
          └──────┬───────┘
                 │
                 ▼
        ┌──────────────────┐
        │  Node.js Backend │  (Render)
        │  Auth + Sessions │
        └──────┬───────────┘
               │
       ┌───────▼────────┐
       │  PostgreSQL DB  │  (Render)
       │ Users / Events  │
       └───────┬────────┘
               │
               ▼
      ┌───────────────────┐
      │ Python ML Service │  (Flask - Render)
      │  Isolation Forest │
      └───────────────────┘
```
This architecture ensures authentication remains fast while anomaly detection runs asynchronously — similar to production-grade systems.
---

## 🔄 Authentication Flow

1. User submits login credentials
2. Backend validates and compares hashed password (bcrypt)
3. JWT tokens are generated:
   - **Access Token** — 15 min lifetime
   - **Refresh Token** — 7 day lifetime
4. Login event is stored in database
5. Backend asynchronously sends data to ML service
6. ML service evaluates anomaly score
7. Suspicious logins are flagged in database
8. Session stored → tokens returned

> ⚡ **Note:** Anomaly detection is non-blocking to avoid login delays.

---

## 🧠 Anomaly Detection (ML Service)

| Property | Detail |
|---|---|
| **Model** | Isolation Forest (Unsupervised) |
| **Training Data** | Synthetic login behavior data |
| **Features** | `hour_of_day`, `ip_changed`, `new_device`, `login_frequency_today` |

**Why Isolation Forest?**
- No labeled attack data required
- Efficient for anomaly detection
- Works well for behavioral deviations

The model learns normal login behavior patterns and flags deviations without requiring labeled attack data.
---

## 🗄️ Database Design

**Tables:** `users` · `sessions` · `login_events`

**Key Design Decisions:**
- `ON DELETE CASCADE` → prevents orphan records
- `flagged` column → marks anomalous logins
- Session storage → enables refresh token revocation

---

## 🖥️ Admin Dashboard

- 📊 Total users, logins, and flagged events
- 🚨 Highlighted suspicious logins
- 🧾 Active session tracking
- 🔐 Admin-only access

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Node.js, Express |
| **Database** | PostgreSQL |
| **Auth** | JWT, bcrypt |
| **ML Service** | Python, Flask, scikit-learn |
| **Frontend** | React |
| **Deployment** | Render, Vercel |

---

## 🚀 Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend + Python Service | Render |
| Database | Render PostgreSQL |

> ⚠️ Render free tier may sleep after inactivity (30–60s cold start on first request).

---

## 🧪 Testing

- ✅ Authentication flows (valid/invalid credentials)
- ✅ RBAC protection
- ✅ Admin endpoints
- ✅ Anomaly detection scenarios
- ✅ Rapid login attempts
- ✅ Deployment behavior (cold starts, logs)

---

## 🧯 Challenges & Fixes

### 1. Python Version Incompatibility
- **Issue:** Python 3.14 broke dependencies
- **Fix:** Pinned to `python-3.11.9`

### 2. Service Communication
- **Issue:** `http.request` complexity
- **Fix:** Switched to Axios for cleaner integration

### 3. Port Binding in Deployment
- **Issue:** Flask not exposed correctly
- **Fix:** Bound to `0.0.0.0` with dynamic `PORT`

### 4. Route Mismatch
- **Issue:** `/analyze` vs `/analyse` inconsistency
- **Fix:** Standardized endpoint naming

### 5. Missing Dependencies Crash
- **Issue:** Axios not installed
- **Fix:** Added to `package.json`

---

## 🔐 Security Considerations

- Same error message for invalid email/password → prevents user enumeration
- Short-lived access tokens → reduces attack window
- Refresh tokens stored server-side → revocable
- Role-based route protection

---

## ⚠️ Limitations

- Uses synthetic training data
- Global model (not per-user)
- Basic IP/device detection heuristics

---

## 🚧 Future Improvements

- [ ] OAuth (Google login)
- [ ] Per-user anomaly models
- [ ] Redis for behavioral tracking
- [ ] Refresh token rotation
- [ ] Real-world dataset integration

---

## 💬 Why This Project?

> Modern authentication systems don’t stop at login — they continuously evaluate user behavior.

This project was built to:
- Understand real-world IAM systems
- Explore security beyond JWT
- Implement behavior-based anomaly detection
- Experience production deployment challenges

---

## 📌 Author

**Proneil Sengupta** — Backend & AI Systems Enthusiast

---

*If you found this interesting, feel free to ⭐ the repo!*
