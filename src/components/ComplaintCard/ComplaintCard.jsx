import React from "react";
import { Clock3, Image as ImageIcon } from "lucide-react";
import "./ComplaintCard.css";

export default function ComplaintCard({ complaint, admin=false, onStatusChange }) {
  return <article className="complaint-card card">
    <div className="cc-top"><span className="issue-chip">{complaint.type}</span><small>{complaint.id}</small></div>
    <p className="cc-text">{complaint.text}</p>
    <div className="cc-meta"><span><Clock3 size={14}/> {complaint.date}</span><span>{complaint.user}</span></div>
    {complaint.photo && <div className="photo-badge"><ImageIcon size={14}/> Photo evidence attached</div>}
    <div className="cc-bottom">
      {admin ? <select value={complaint.status} onChange={(e)=>onStatusChange(complaint.id,e.target.value)}>
        <option>Under Review</option><option>Action Taken</option><option>Resolved</option>
      </select> : <span className={`status ${complaint.status.replaceAll(" ","-").toLowerCase()}`}>{complaint.status}</span>}
    </div>
  </article>;
}