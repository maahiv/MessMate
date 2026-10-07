import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import AppShell from "./components/layout/AppShell.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import StudentDashboard from "./pages/student/Dashboard.jsx";
import StudentMenu from "./pages/student/Menu.jsx";
import StudentComplaints from "./pages/student/Complaints.jsx";
import StudentPolls from "./pages/student/Polls.jsx";
import MyComplaints from "./pages/student/MyComplaints.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import AdminComplaints from "./pages/admin/Complaints.jsx";
import AdminMenu from "./pages/admin/MenuManagement.jsx";
import AdminPolls from "./pages/admin/PollManagement.jsx";

function Protected({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading MessMate…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/student" element={<Protected role="student"><AppShell /></Protected>}>
        <Route index element={<StudentDashboard />} />
        <Route path="menu" element={<StudentMenu />} />
        <Route path="complaints" element={<StudentComplaints />} />
        <Route path="polls" element={<StudentPolls />} />
        <Route path="my-complaints" element={<MyComplaints />} />
      </Route>

      <Route path="/admin" element={<Protected role="admin"><AppShell /></Protected>}>
        <Route index element={<AdminDashboard />} />
        <Route path="complaints" element={<AdminComplaints />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="polls" element={<AdminPolls />} />
      </Route>

      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading MessMate…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "admin" ? "/admin" : "/student"} replace />;
}