import React,{useState} from "react";
import { Link,useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Auth.css";

export default function Register(){
  const {register}=useAuth(); const navigate=useNavigate();
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState("");
  async function submit(e){
    e.preventDefault(); setError("");
    try { await register(name,email,password); navigate("/student"); }
    catch(err){ setError(err.message || "Registration failed"); }
  }
  return <div className="auth-page"><div className="auth-box"><div className="auth-logo">🍱</div><h1>Create account</h1><p>Join your hostel's transparent mess community.</p>
    <form onSubmit={submit}>
      <label>Full name<input value={name} onChange={e=>setName(e.target.value)} required placeholder="Your name"/></label>
      <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com"/></label>
      <label>Password<input type="password" minLength="6" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="At least 6 characters"/></label>
      {error && <div className="auth-error">{error}</div>}
      <button className="auth-submit">Create Account</button>
    </form>
    <p className="auth-switch">Already registered? <Link to="/login">Login</Link></p>
    <span className="auth-back">Student accounts only. Admin access is controlled separately.</span>
  </div></div>
}