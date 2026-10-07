import React from "react";
import "./StatCard.css";
export default function StatCard({icon,label,value,note,tone}){return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div>}