import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";


function Navbar() {
  const [projectCount, setProjectCount] =
  useState(0);

const [taskCount, setTaskCount] =
  useState(0);

useEffect(() => {
  loadCounts();
}, []);

const loadCounts = async () => {
  try {
    const projects =
      await api.get("/projects");

    const tasks =
      await api.get("/tasks");

    setProjectCount(
      projects.data.length
    );

    setTaskCount(
      tasks.data.length
    );
  } catch (error) {
    console.log(error);
  }
};
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
  if (
    window.confirm(
      "Are you sure you want to logout?"
    )
  ) {
    localStorage.removeItem("token");
    window.location.href = "/";
  }
};
  

  const linkStyle = (path) => ({
    display: "block",
    padding: "12px 16px",
    borderRadius: "8px",
    color:
      location.pathname === path
        ? "#ffffff"
        : "#cbd5e1",
    background:
      location.pathname === path
        ? "#2563eb"
        : "transparent",
    marginBottom: "8px"
  });

  return (
    <div
      style={{
        width: "240px",
        height: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "20px",
        position: "fixed",
        left: 0,
        top: 0
      }}
    >
      <div
  style={{
    marginBottom: "30px"
  }}
>
  <div
  style={{
    marginBottom: "30px",
    textAlign: "center"
  }}
>
  <h2
    style={{
      color: "white"
    }}
  >
    ProjectFlow
  </h2>

  
</div>

  <p
    style={{
      color: "#94a3b8",
      fontSize: "14px",
      marginTop: "5px"
    }}
  >
    Project Management System
  </p>
</div>

      <Link
        to="/dashboard"
        style={linkStyle("/dashboard")}
      >
        Dashboard
      </Link>

      <Link
  to="/projects"
  style={linkStyle("/projects")}
>
  Projects ({projectCount})
</Link>

      <Link
  to="/tasks"
  style={linkStyle("/tasks")}
>
  Tasks ({taskCount})
</Link>
      <div
  style={{
    marginTop: "40px",
    marginBottom: "20px",
    padding: "12px",
    background: "#1e293b",
    borderRadius: "10px"
  }}
>
  <p
    style={{
      color: "white",
      fontWeight: "600"
    }}
  >
    User
  </p>

  <small
    style={{
      color: "#94a3b8"
    }}
  >
    Active Session
  </small>
</div>

      <button
        onClick={logout}
        style={{
          width: "100%",
          marginTop: "20px",
          background: "#dc2626"
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;