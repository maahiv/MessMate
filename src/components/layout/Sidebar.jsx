import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Utensils, ShieldAlert, Vote, ClipboardList, X, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Sidebar.css";

export default function Sidebar({ open, setOpen }) {
  const { user, logout } = useAuth();
  const items = user.role === "admin"
    ? [
        ["/admin","Dashboard",LayoutDashboard],
        ["/admin/complaints","Complaints",ShieldAlert],
        ["/admin/menu","Menu Management",Utensils],
        ["/admin/polls","Poll Management",Vote]
      ]
    : [
        ["/student","Dashboard",LayoutDashboard],
        ["/student/menu","Mess Menu",Utensils],
        ["/student/complaints","Food Complaints",ShieldAlert],
        ["/student/polls","Food Polls",Vote],
        ["/student/my-complaints","My Complaints",ClipboardList]
      ];

  return <>
    {open && <div className="side-overlay" onClick={()=>setOpen(false)}/>}
    <aside className={`side ${open?"side-open":""}`}>
      <div className="side-brand">
        <span className="brand-emoji">🍱</span>
        <div><b>MessMate</b><small>{user.role === "admin" ? "Admin Panel" : "Smart mess management"}</small></div>
        <button onClick={()=>setOpen(false)} className="side-close"><X/></button>
      </div>
      <p className="side-caption">{user.role === "admin" ? "MANAGEMENT" : "STUDENT"}</p>
      <nav>{items.map(([to,label,Icon])=><NavLink key={to} to={to} end={to==="/student"||to==="/admin"} onClick={()=>setOpen(false)} className={({isActive})=>`side-link ${isActive?"active":""}`}><Icon size={18}/><span>{label}</span></NavLink>)}</nav>
      <div className="side-bottom">
        <div className="profile-mini"><span>{user.name?.slice(0,2).toUpperCase()}</span><div><b>{user.name}</b><small>{user.role}</small></div></div>
        <button className="logout-btn" onClick={logout}><Settings size={16}/> Logout</button>
      </div>
    </aside>
  </>;
}