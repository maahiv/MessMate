import React from "react";
import { useSelector } from "react-redux";
import SectionTitle from "../../components/SectionTitle/SectionTitle.jsx";
import ComplaintCard from "../../components/ComplaintCard/ComplaintCard.jsx";

export default function MyComplaints(){const complaints=useSelector(s=>s.complaints);return <div><SectionTitle title="My Complaints" subtitle="Track what happened after you reported an issue."/><div className="complaint-grid">{complaints.map(c=><ComplaintCard key={c.id} complaint={c}/>)}</div></div>}