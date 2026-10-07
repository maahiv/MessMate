import React from "react";
import { NavLink } from "react-router-dom";
import { ShieldAlert,Vote,Star,Utensils,ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import StatCard from "../../components/StatCard/StatCard.jsx";
import SectionTitle from "../../components/SectionTitle/SectionTitle.jsx";
import MealCard from "../../components/MealCard/MealCard.jsx";
import "./Dashboard.css";

export default function StudentDashboard(){
  const menu=useSelector(s=>s.menu); const complaints=useSelector(s=>s.complaints); const polls=useSelector(s=>s.polls);
  const todayIndex=(new Date().getDay()+6)%7; const today=menu[todayIndex]||menu[0];
  return <div>
    <div className="student-hero"><div><span>Tuesday, 6 October</span><h2>Your mess, your voice.</h2><p>See today's meals, report food issues, and vote on changes.</p><div className="hero-actions"><NavLink to="/student/complaints">Report an issue <ArrowRight size={14}/></NavLink><NavLink to="/student/polls">Vote on menu <ArrowRight size={14}/></NavLink></div></div><div className="hero-art">🍛</div></div>
    <div className="student-stats">
      <StatCard icon={<ShieldAlert/>} label="Active complaints" value={complaints.filter(c=>c.status!=="Resolved").length} note="Publicly trackable" tone="red"/>
      <StatCard icon={<Vote/>} label="Active polls" value={polls.length} note="Make your choice" tone="purple"/>
      <StatCard icon={<Star/>} label="Food rating" value="3.8/5" note="This month" tone="yellow"/>
      <StatCard icon={<Utensils/>} label="Menu days" value="7" note="Full week visible" tone="green"/>
    </div>
    <div className="dash-grid">
      <section className="card pd"><SectionTitle title={`${today.day}'s Menu`} subtitle="Current meals + alternatives"/><div className="today-meals">{["breakfast","lunch","snacks","dinner"].map(m=><MealCard key={m} meal={m} value={today[m]} options={today.options[m]}/>)}</div></section>
      <section className="card pd"><SectionTitle title="Food Safety" subtitle="Latest reported issues"/>{complaints.slice(0,4).map(c=><div className="issue-row" key={c.id}><span className="issue-dot"/><div><b>{c.type}</b><small>{c.text}</small></div><span className="muted">{c.status}</span></div>)}</section>
    </div>
    <section className="card pd"><SectionTitle title="Open polls" subtitle="Student preference is visible before committee decisions"/><div className="poll-strip">{polls.slice(0,3).map(p=><div className="mini-poll" key={p.id}><b>{p.question}</b><small>{p.total} votes · {p.ends}</small><NavLink to="/student/polls">Vote now</NavLink></div>)}</div></section>
  </div>
}