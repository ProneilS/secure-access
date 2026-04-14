import React, { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password
      });

      if (res.data.user.role !== "admin") {
        setError("Access denied — admin accounts only");
        setLoading(false);
        return;
      }

      onLogin(res.data.accessToken);

    } catch (err) {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>SecureAccess</h1>
        <p style={styles.sub}>Admin Dashboard Login</p>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="admin@secure.com"
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="••••••••"
            style={styles.input}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f3f4f6"
  },
  card: {
    background: "white",
    borderRadius: "12px",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1a1a2e",
    margin: "0 0 4px"
  },
  sub: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "0 0 24px"
  },
  error: {
    background: "#fef2f2",
    color: "#dc2626",
    fontSize: "13px",
    padding: "10px 14px",
    borderRadius: "6px",
    marginBottom: "16px",
    border: "1px solid #fee2e2"
  },
  field: {
    marginBottom: "16px"
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "6px"
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    outline: "none",
    fontFamily: "sans-serif"
  },
  btn: {
    width: "100%",
    padding: "10px",
    background: "#1a1a2e",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    marginTop: "8px"
  }
};

export default Login;