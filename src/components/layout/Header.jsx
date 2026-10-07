import React from "react";
import { Bell, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Header.css";

export default function Header({ onMenu }) {
  const { user } = useAuth();
  const title = user.role === "admin" ? "Admin control center" : `Good evening, ${user.name?.split(" ")[0]} 👋`;
  const sub = user.role === "admin" ? "Review issues, manage menus and publish polls." : "Here’s what’s happening in your mess today.";
  return <header className="topbar">
    <button className="top-menu" onClick={onMenu}><Menu/></button>
    <div><h1>{title}</h1><p>{sub}</p></div>
    <button className="bell"><Bell size={19}/><i/></button>
    <div className="top-avatar">{user.name?.slice(0,2).toUpperCase()}</div>
  </header>;
}