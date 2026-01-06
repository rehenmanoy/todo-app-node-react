import { useState } from "react";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import "./login.css";
import { useNavigate } from "react-router-dom"


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regName , setRegName] = useState("");
  const [regEmail , setRegEmail] = useState("");
  const [regPassword , setRegPassword] = useState("");
  const [regConfirmPassword , setRegConfirmPassword] = useState("");
  const [error] = useState(null); // you will handle later
  const [showRegister , setShowRegister] = useState(false)
  const navigate = useNavigate()

  const API_BASE = import.meta.env.VITE_API_BASE;
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE}/login`, {
       method : "POST",
       headers : {"Content-Type":"application/json"},
       body : JSON.stringify({email , password}),
    });

    const data = await res.json();
    if(res.ok){
        console.log("Login Successfull")
        localStorage.setItem("token" , data.accessToken)
        navigate("/todo")
    }else{
        console.log("Login Invalid")
    }

  };

  const handleRegister = async (e) => {
      e.preventDefault();
      if(regPassword !== regConfirmPassword){
          alert("Passwords Dont Match!")
          return;
      }
      const res = await fetch(`${API_BASE}/createUser`, {
          method : "POST",
          headers : {"Content-Type" : "application/json"},
          body : JSON.stringify({ name : regName , email : regEmail , password : regPassword})
      });
      const data = await res.json()
      if(res.ok){
          alert(`${regName} registered Successfully`)
          setShowRegister(false)
      }else{
          alert(data.error || "Registration Failed")
      }
  };
  const handleCancelRegister = () => {
  setRegName("");
  setRegEmail("");
  setRegPassword("");
  setRegConfirmPassword("");
  setShowRegister(false);
  };

  return (
    <div className="app">
      <div className="notebook">
        <div className="hole-punches">
          <span></span><span></span><span></span>
        </div>
        <div className="margin-line"></div>

        <header className="header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Log in to your notebook</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <Lock size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="error-msg">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <button className="login-btn" type="submit">
            <LogIn size={18} />
            Login
          </button>
            <p className="register-text">
                Don’t have an account?
             <span onClick={() => setShowRegister(true)}> Register</span>
            </p>

        </form>
        {showRegister && (
  <div className="modal-overlay">
  <div className="modal">
  <h2>Create Account</h2>

  <form onSubmit={handleRegister}>
    <input
      type="text"
      placeholder="Name"
      value={regName}
      onChange={(e) => setRegName(e.target.value)}
    />

    <input
      type="email"
      placeholder="Email"
      value={regEmail}
      onChange={(e) => setRegEmail(e.target.value)}
    />

    <input
      type="password"
      placeholder="Password"
      value={regPassword}
      onChange={(e) => setRegPassword(e.target.value)}
    />

    <input
      type="password"
      placeholder="Re-Enter Password"
      value={regConfirmPassword}
      onChange={(e) => setRegConfirmPassword(e.target.value)}
    />

    <div className="modal-actions">
      <button
        type="button"
        className="cancel"
        onClick={handleCancelRegister}
      >
        Cancel
      </button>

      <button type="submit" className="submit">
        Register
      </button>
    </div>
  </form>
</div>

  </div>
)}

        <footer className="footer">
          ✎ One step closer to getting things done
        </footer>
      </div>
    </div>
  );
}

export default Login;
