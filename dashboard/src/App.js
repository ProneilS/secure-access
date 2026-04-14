import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./components/Login";
import StatsCards from "./components/StatsCards";
import LoginEvents from "./components/LoginEvents";
import Sessions from "./components/Sessions";

function App() {
  const [token, setToken] = useState(null);
  const [stats, setStats] = useState(null);
  const [loginEvents, setLoginEvents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = async (t) => {
    const activeToken = t || token;
    if (!activeToken) return;

    const api = axios.create({
      baseURL: "http://localhost:3000/api/admin",
      headers: { Authorization: `Bearer ${activeToken}` }
    });

    try {
      const [statsRes, eventsRes, sessionsRes] = await Promise.all([
        api.get("/stats"),
        api.get("/login-events"),
        api.get("/sessions")
      ]);
      setStats(statsRes.data);
      setLoginEvents(eventsRes.data);
      setSessions(sessionsRes.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setToken(null); // token expired — back to login
      } else {
        setError("Failed to fetch data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (newToken) => {
    setToken(newToken);
    setLoading(true);
    fetchAll(newToken);
  };

  const handleLogout = () => {
    setToken(null);
    setStats(null);
    setLoginEvents([]);
    setSessions([]);
  };

  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => fetchAll(token), 10000);
    return () => clearInterval(interval);
  }, [token]);

  if (!token) return <Login onLogin={handleLogin} />;
  if (loading) return <div style={styles.center}>Loading dashboard...</div>;
  if (error) return <div style={styles.center}>{error}</div>;

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <h1 style={styles.title}>SecureAccess — Admin Dashboard</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => fetchAll(token)} style={styles.btn}>Refresh</button>
          <button onClick={handleLogout} style={{ ...styles.btn, background: "#f3f4f6", color: "#374151" }}>Logout</button>
        </div>
      </div>
      {stats && <StatsCards stats={stats} />}
      <LoginEvents events={loginEvents} />
      <Sessions sessions={sessions} />
    </div>
  );
}

const styles = {
  root: { fontFamily: "sans-serif", padding: "24px", maxWidth: "1100px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { fontSize: "20px", fontWeight: "600", margin: 0 },
  btn: { padding: "8px 16px", background: "#1a1a2e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
  center: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontSize: "16px" }
};

export default App;