import React,{useState} from "react";
import { Link,useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Auth.css";

export default function Login(){
  const {login}=useAuth(); const navigate=useNavigate();
  const [role,setRole]=useState("student"); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState("");
  async function submit(e){e.preventDefault();setError("");try{const u=await login(email,password,role);navigate(u.role==="admin"?"/admin":"/student")}catch(err){setError(err.message)}}
  return <div className="auth-page"><div className="auth-box">
    <div className="auth-logo">🍱</div><h1>Welcome to MessMate</h1><p>Food safety, better choices, stronger student voice.</p>
    <div className="role-tabs"><button className={role==="student"?"on":""} onClick={()=>setRole("student")}>Student</button><button className={role==="admin"?"on":""} onClick={()=>setRole("admin")}>Admin</button></div>
    <form onSubmit={submit}><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com"/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••"/></label>{error&&<div className="auth-error">{error}</div>}<button className="auth-submit">Login</button></form>
    <div className="demo-box"><b>Demo mode</b><br/>Student: student@messmate.demo / student123<br/>Admin: admin@messmate.demo / admin123</div>
    <p className="auth-switch">New student? <Link to="/register">Create an account</Link></p>
  </div></div>
}