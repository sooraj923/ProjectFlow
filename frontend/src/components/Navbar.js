import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function Navbar() {
  const [projectCount, setProjectCount] =
    useState(0);

  const [taskCount, setTaskCount] =
    useState(0);

  const [showLogoutModal,
    setShowLogoutModal] =
    useState(false);

  const location = useLocation();

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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");

    window.location.href = "/";
  };

  const linkStyle = (path) => ({
    display: "block",
    padding: "12px 16px",
    borderRadius: "10px",
    color:
      location.pathname === path
        ? "#ffffff"
        : "#cbd5e1",
    background:
      location.pathname === path
        ? "#2563eb"
        : "transparent",
    marginBottom: "10px",
    fontWeight: "500"
  });

  return (
    <>
      <div
        style={{
          width: "240px",
          height: "100vh",
          background: "#0f172a",
          color: "white",
          padding: "22px",
          position: "fixed",
          left: 0,
          top: 0
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "35px"
          }}
        >
          <h1
  style={{
    fontSize: "28px",
    fontWeight: "700",
    letterSpacing: "-1px"
  }}
>
  ProjectFlow
</h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "14px"
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
            padding: "15px",
            background: "#1e293b",
            borderRadius: "12px"
          }}
        >
          <p
            style={{
              fontWeight: "600",
              marginBottom: "5px"
            }}
          >
            Active Session
          </p>

          <small
            style={{
              color: "#94a3b8"
            }}
          >
            Logged In
          </small>
        </div>

        <button
          onClick={() =>
            setShowLogoutModal(true)
          }
          style={{
            width: "100%",
            marginTop: "25px",
            background: "#dc2626"
          }}
        >
          Logout
        </button>
      </div>

      {showLogoutModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}
        >
          <div
            style={{
              background: "white",
              width: "380px",
              padding: "30px",
              borderRadius: "16px",
              textAlign: "center",
              boxShadow:
                "0 15px 35px rgba(0,0,0,0.15)"
            }}
          >
            <h2
              style={{
                color: "#0f172a",
                marginBottom: "12px"
              }}
            >
              Logout
            </h2>

            <p
              style={{
                color: "#64748b",
                marginBottom: "25px"
              }}
            >
              Are you sure you want to logout?
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px"
              }}
            >
              <button
                style={{
                  background: "#64748b"
                }}
                onClick={() =>
                  setShowLogoutModal(false)
                }
              >
                Cancel
              </button>

              <button
                style={{
                  background: "#dc2626"
                }}
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;