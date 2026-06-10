import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);

  const navigate = useNavigate();

  const userName =
    localStorage.getItem("userName");

  const isAdmin =
    localStorage.getItem("userEmail") ===
    "admin@gmail.com";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const projectRes =
        await api.get("/projects");

      const taskRes =
        await api.get("/tasks");

      const activityRes =
        await api.get("/activity");

      setProjects(projectRes.data);
      setTasks(taskRes.data);
      setActivities(activityRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  const completedTasks =
    tasks.filter(
      (task) => task.status === "Done"
    ).length;

  const pendingTasks =
    tasks.filter(
      (task) => task.status !== "Done"
    ).length;

  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedTasks /
            tasks.length) *
            100
        );

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1400px",
        margin: "auto"
      }}
    >
      <div
        className="card"
        style={{
          marginBottom: "20px"
        }}
      >
        <h1>
          Welcome back, {userName}
        </h1>

        <p
          style={{
            color: "#64748b",
            marginTop: "8px"
          }}
        >
          Monitor projects, tasks and
          team activity.
        </p>

        <p
          style={{
            color: "#94a3b8",
            marginTop: "10px",
            fontSize: "14px"
          }}
        >
          {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="dashboard-grid">
        <div
          className="stat-card"
          onClick={() =>
            navigate("/projects")
          }
          style={{
            borderLeft:
              "5px solid #2563eb",
            cursor: "pointer"
          }}
        >
          <h2>{projects.length}</h2>
          <p>Total Projects</p>
        </div>

        <div
          className="stat-card"
          onClick={() =>
            navigate("/tasks")
          }
          style={{
            borderLeft:
              "5px solid #16a34a",
            cursor: "pointer"
          }}
        >
          <h2>{tasks.length}</h2>
          <p>Total Tasks</p>
        </div>

        <div
          className="stat-card"
          onClick={() =>
            navigate("/tasks")
          }
          style={{
            borderLeft:
              "5px solid #ca8a04",
            cursor: "pointer"
          }}
        >
          <h2>{completedTasks}</h2>
          <p>Completed Tasks</p>
        </div>

        <div
          className="stat-card"
          onClick={() =>
            navigate("/tasks")
          }
          style={{
            borderLeft:
              "5px solid #dc2626",
            cursor: "pointer"
          }}
        >
          <h2>{pendingTasks}</h2>
          <p>Pending Tasks</p>
        </div>
      </div>

      <br />

      <div className="card">
        <h2
          style={{
            marginBottom: "15px"
          }}
        >
          Project Progress
        </h2>

        <div
          style={{
            width: "100%",
            background: "#e5e7eb",
            borderRadius: "20px",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              background: "#10b981",
              color: "white",
              padding: "10px",
              textAlign: "center",
              fontWeight: "bold"
            }}
          >
            {progress}%
          </div>
        </div>

        <br />

        <p>
          {completedTasks} of{" "}
          {tasks.length} tasks
          completed
        </p>
      </div>

      <br />

      <div className="card">
        <h2
          style={{
            marginBottom: "15px"
          }}
        >
          Quick Actions
        </h2>

        <Link to="/tasks">
          <button>
            Open Task Board
          </button>
        </Link>

        {" "}

        <button
          onClick={() => {
            localStorage.removeItem(
              "token"
            );
            localStorage.removeItem(
              "userName"
            );
            localStorage.removeItem(
              "userEmail"
            );

            window.location.href =
              "/";
          }}
        >
          Logout
        </button>
      </div>

      <br />

      {isAdmin && (
        <div className="card">
          <h2
            style={{
              marginBottom: "15px"
            }}
          >
            Recent Activity
          </h2>

          {activities.length === 0 ? (
            <p>
              No activity available
            </p>
          ) : (
            activities.map(
              (activity) => (
                <div
                  key={
                    activity._id
                  }
                  style={{
                    padding:
                      "14px 0",
                    borderBottom:
                      "1px solid #e5e7eb"
                  }}
                >
                  <p>
                    {
                      activity.action
                    }
                  </p>

                  <small>
                    {new Date(
                      activity.createdAt
                    ).toLocaleString()}
                  </small>
                </div>
              )
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;