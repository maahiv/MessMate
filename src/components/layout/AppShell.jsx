import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import "./AppShell.css";

export default function AppShell() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="shell">
      <Sidebar open={open} setOpen={setOpen}/>
      <main className="shell-main">
        <Header onMenu={() => setOpen(true)}/>
        <section className="shell-content"><Outlet/></section>
      </main>
    </div>
  );
}