from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import os

app = Flask(__name__)

# Train model on startup
def train_model():
    df = pd.read_csv("training_data.csv")
    features = ["hour_of_day", "ip_changed", "new_device", "login_frequency_today"]
    X = df[features]
    
    model = IsolationForest(
        n_estimators=100,
        contamination=0.05,  # expect ~5% anomalies
        random_state=42
    )
    model.fit(X)
    print("Anomaly model trained successfully")
    return model

model = train_model()

# Track login frequency per user in memory
# In production this would be Redis or a DB query
login_counts = {}

@app.route("/analyse", methods=["POST"])
def analyse():
    try:
        data = request.get_json()

        # Validate input
        required = ["user_id", "ip_address", "user_agent", "hour_of_day"]
        for field in required:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        user_id = str(data["user_id"])
        ip_address = data["ip_address"]
        user_agent = data["user_agent"]
        hour_of_day = int(data["hour_of_day"])

        # Track login frequency today (resets on service restart for now)
        login_counts[user_id] = login_counts.get(user_id, 0) + 1
        frequency = login_counts[user_id]

        # Simple heuristics for ip_changed and new_device
        # In production you'd compare against last known IP/device from DB
        ip_changed = 0 if ip_address in ["127.0.0.1", "::1", "::ffff:127.0.0.1"] else 1
        new_device = 0 if "curl" in user_agent.lower() or "postman" in user_agent.lower() else 1

        # Build feature vector
        features = pd.DataFrame([{
            "hour_of_day": hour_of_day,
            "ip_changed": ip_changed,
            "new_device": new_device,
            "login_frequency_today": frequency
        }])

        # Predict — IsolationForest returns -1 for anomaly, 1 for normal
        prediction = model.predict(features)[0]
        score = model.score_samples(features)[0]

        # Normalize score to 0.0–1.0 range (higher = more anomalous)
        risk_score = round(float(1 - (score + 0.5)), 3)
        risk_score = max(0.0, min(1.0, risk_score))  # clamp between 0 and 1

        flagged = bool(prediction == -1)

        return jsonify({
            "user_id": data["user_id"],
            "risk_score": risk_score,
            "flagged": flagged,
            "details": {
                "hour_of_day": hour_of_day,
                "ip_changed": bool(ip_changed),
                "new_device": bool(new_device),
                "login_frequency_today": frequency
            }
        })

    except Exception as e:
        print(f"Analysis error: {e}")
        return jsonify({"error": "Analysis failed"}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "isolation_forest"})

if __name__ == "__main__":
    app.run(port=5000, debug=True)