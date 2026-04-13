import React from "react";

function StatsCards({ stats }) {
  const cards = [
    { label: "Total Users", value: stats.total_users, color: "#3b82f6" },
    { label: "Total Logins", value: stats.total_logins, color: "#10b981" },
    { label: "Flagged Logins", value: stats.total_flagged, color: stats.total_flagged > 0 ? "#ef4444" : "#10b981" }
  ];

  return (
    <div style={styles.grid}>
      {cards.map((card) => (
        <div key={card.label} style={{ ...styles.card, borderTop: `4px solid ${card.color}` }}>
          <div style={styles.label}>{card.label}</div>
          <div style={{ ...styles.value, color: card.color }}>{card.value}</div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" },
  card: { background: "#f9fafb", borderRadius: "8px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  label: { fontSize: "13px", color: "#6b7280", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" },
  value: { fontSize: "32px", fontWeight: "700" }
};

export default StatsCards;