import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });
      localStorage.setItem(
  "userEmail",
  res.data.user.email
);

      localStorage.setItem(
  "token",
  res.data.token
);

localStorage.setItem(
  "userName",
  res.data.user.name
);

navigate("/dashboard");
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #0f172a, #1e293b)"
      }}
    >
      <div
        style={{
          width: "420px",
          background: "#ffffff",
          padding: "35px",
          borderRadius: "20px",
          boxShadow:
            "0 20px 45px rgba(0,0,0,0.12)"
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#0f172a",
            marginBottom: "10px"
          }}
        >
          ProjectFlow
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#64748b",
            marginBottom: "30px"
          }}
        >
          Sign in to continue
        </p>

        <label
  style={{
    fontSize: "14px",
    fontWeight: "500",
    color: "#334155"
  }}
>
  Email Address
</label>

<div style={{ height: "8px" }} />

<input
  type="email"
          
          placeholder="Email Address"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <br />
        <br />

        <label
  style={{
    fontSize: "14px",
    fontWeight: "500",
    color: "#334155"
  }}
>
  Password
</label>

<div style={{ height: "8px" }} />

<input
  type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {error && (
  <p
    style={{
      color: "#dc2626",
      fontSize: "14px",
      marginTop: "12px",
      marginBottom: "15px"
    }}
  >
    {error}
  </p>
)}

<div
  style={{
    height: "15px"
  }}
></div>

<button
  onClick={handleLogin}
  style={{
    width: "100%",
    padding: "14px",
    fontSize: "15px",
    fontWeight: "600"
  }}
>
          Login
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#475569"
          }}
        >
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;