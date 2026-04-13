import React, { useState, useEffect } from "react";
import axios from "axios";
import StatsCards from "./components/StatsCards";
import LoginEvents from "./components/LoginEvents";
import Sessions from "./components/Sessions";

const ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoiYWRtaW5Ac2VjdXJlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NjA3NzU0NywiZXhwIjoxNzc2MDc4NDQ3fQ.wZb6ocZuoF86NnyzkBiSlaxwfojpK_TCz_djvzV4VuU";

const api = axios.create({
  baseURL: "http://localhost:3000/api/admin",
  headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
});

function App() {
  const [stats, setStats] = useState(null);
  const [loginEvents, setLoginEvents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
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
      setError("Failed to fetch data. Is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 10000); // auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={styles.center}>Loading dashboard...</div>;
  if (error) return <div style={styles.center}>{error}</div>;

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <h1 style={styles.title}>SecureAccess — Admin Dashboard</h1>
        <button onClick={fetchAll} style={styles.refreshBtn}>Refresh</button>
      </div>
      <StatsCards stats={stats} />
      <LoginEvents events={loginEvents} />
      <Sessions sessions={sessions} />
    </div>
  );
}

const styles = {
  root: { fontFamily: "sans-serif", padding: "24px", maxWidth: "1100px", margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  title: { fontSize: "20px", fontWeight: "600", margin: 0 },
  refreshBtn: { padding: "8px 16px", background: "#1a1a2e", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
  center: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontSize: "16px" }
};

export default App;