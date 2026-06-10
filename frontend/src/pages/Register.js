import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Register() {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] =
useState("");
const [confirmPassword,
setConfirmPassword] =
useState("");

const [error, setError] =
useState("");

const [success, setSuccess] =
useState("");

const handleRegister = async () => {
setError("");
setSuccess("");

if (!name.trim()) {
  setError("Name is required");
  return;
}

if (name.length < 3) {
  setError(
    "Name must be at least 3 characters"
  );
  return;
}

const emailRegex =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  setError(
    "Please enter a valid email"
  );
  return;
}

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

if (!passwordRegex.test(password)) {
  setError(
    "Password must contain uppercase, lowercase, number and special character"
  );
  return;
}

if (
  password !== confirmPassword
) {
  setError(
    "Passwords do not match"
  );
  return;
}

try {
  await api.post("/auth/register", {
    name,
    email,
    password
  });

  setSuccess(
  "Registration successful. Redirecting..."
);

setTimeout(() => {
  window.location.href = "/";
}, 2000);

  setName("");
  setEmail("");
  setPassword("");
  setConfirmPassword("");
} catch (error) {
  setError(
    "Registration failed"
  );
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
"linear-gradient(135deg,#0f172a,#1e293b)"
}}
>
<div
style={{
width: "420px",
background: "white",
padding: "35px",
borderRadius: "20px",
boxShadow:
"0 20px 45px rgba(0,0,0,0.12)"
}}
>
<h1
style={{
textAlign: "center",
marginBottom: "10px"
}}
>
ProjectFlow </h1>

    <p
      style={{
        textAlign: "center",
        color: "#64748b",
        marginBottom: "30px"
      }}
    >
      Create your account
    </p>

    <label>Full Name</label>
    <div style={{ height: "8px" }} />

    <input
      type="text"
      value={name}
      placeholder="Enter your name"
      onChange={(e) =>
        setName(e.target.value)
      }
    />

    <div style={{ height: "16px" }} />

    <label>Email Address</label>
    <div style={{ height: "8px" }} />

    <input
      type="email"
      value={email}
      placeholder="Enter your email"
      onChange={(e) =>
        setEmail(e.target.value)
      }
    />

    <div style={{ height: "16px" }} />

    <label>Password</label>
    <div style={{ height: "8px" }} />

    <input
      type="password"
      value={password}
      placeholder="Create password"
      onChange={(e) =>
        setPassword(e.target.value)
      }
    />

    <div style={{ height: "16px" }} />

    <label>Confirm Password</label>
    <div style={{ height: "8px" }} />

    <input
      type="password"
      value={confirmPassword}
      placeholder="Confirm password"
      onChange={(e) =>
        setConfirmPassword(
          e.target.value
        )
      }
    />

    {error && (
      <p
        style={{
          color: "#dc2626",
          marginTop: "15px",
          fontSize: "14px"
        }}
      >
        {error}
      </p>
    )}

    {success && (
      <p
        style={{
          color: "#16a34a",
          marginTop: "15px",
          fontSize: "14px"
        }}
      >
        {success}
      </p>
    )}

    <div style={{ height: "20px" }} />

    <button
      onClick={handleRegister}
      style={{
        width: "100%",
        padding: "14px",
        fontWeight: "600"
      }}
    >
      Register
    </button>

    <p
      style={{
        textAlign: "center",
        marginTop: "20px"
      }}
    >
      Already have an account?{" "}
      <Link to="/">
        Login
      </Link>
    </p>
  </div>
</div>

);
}

export default Register;
