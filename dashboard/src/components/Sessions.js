import React from "react";

function Sessions({ sessions }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.heading}>Active Sessions</h2>
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {["User", "IP Address", "User Agent", "Created", "Expires"].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 && (
              <tr><td colSpan={5} style={styles.empty}>No active sessions</td></tr>
            )}
            {sessions.map((s) => (
              <tr key={s.id} style={{ background: "white" }}>
                <td style={styles.td}>{s.email}</td>
                <td style={styles.td}>{s.ip_address}</td>
                <td style={{ ...styles.td, maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.user_agent}
                </td>
                <td style={styles.td}>{new Date(s.created_at).toLocaleString()}</td>
                <td style={styles.td}>{new Date(s.expires_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  section: { marginBottom: "32px" },
  heading: { fontSize: "16px", fontWeight: "600", marginBottom: "12px" },
  tableWrap: { overflowX: "auto", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  table: { width: "100%", borderCollapse: "collapse", background: "white" },
  th: { padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" },
  td: { padding: "12px 16px", fontSize: "14px", color: "#374151", borderBottom: "1px solid #e5e7eb" },
  empty: { padding: "24px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }
};

export default Sessions;