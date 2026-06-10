import { useState, useEffect } from "react";
import api from "../services/api";

function Tasks() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterUser, setFilterUser] = useState("All");

  const [tasks, setTasks] = useState([]);

  const [editingTask, setEditingTask] = useState(null);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAssignedTo, setEditAssignedTo] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createTask = async () => {
    try {
      await api.post("/tasks", {
        title,
        description,
        assignedTo,
        dueDate,
        priority,
        status: "Todo"
      });

      setTitle("");
      setDescription("");
      setAssignedTo("");
      setDueDate("");
      setPriority("Medium");

      loadTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (task, status) => {
    try {
      await api.put(`/tasks/${task._id}`, {
        title: task.title,
        description: task.description,
        assignedTo: task.assignedTo,
        dueDate: task.dueDate,
        priority: task.priority,
        status
      });

      loadTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      loadTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const startEdit = (task) => {
    setEditingTask(task._id);

    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditAssignedTo(task.assignedTo);
    setEditPriority(task.priority || "Medium");

    setEditDueDate(
      task.dueDate
        ? task.dueDate.substring(0, 10)
        : ""
    );
  };

  const saveEdit = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, {
        title: editTitle,
        description: editDescription,
        assignedTo: editAssignedTo,
        dueDate: editDueDate,
        priority: editPriority,
        status: task.status
      });

      setEditingTask(null);
      loadTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const isOverdue = (task) => {
    if (!task.dueDate) return false;
    if (task.status === "Done") return false;

    return new Date(task.dueDate) < new Date();
  };

  const users = [
    "All",
    ...new Set(
      tasks
        .map((task) => task.assignedTo)
        .filter(Boolean)
    )
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      (task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesUser =
      filterUser === "All" ||
      task.assignedTo === filterUser;

    return matchesSearch && matchesUser;
  });

  const todoTasks = filteredTasks.filter(
    (task) => task.status === "Todo"
  );

  const progressTasks = filteredTasks.filter(
    (task) => task.status === "In Progress"
  );

  const doneTasks = filteredTasks.filter(
    (task) => task.status === "Done"
  );

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "Low":
        return "priority-low";
      case "Medium":
        return "priority-medium";
      case "High":
        return "priority-high";
      case "Critical":
        return "priority-critical";
      default:
        return "";
    }
  };

  const renderTask = (task) => {
    const isEditing = editingTask === task._id;

    return (
      <div key={task._id} className="task-card" style={{ marginBottom: "12px" }}>
        {isEditing ? (
          <>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              style={{ width: "100%" }}
            />
            <br /><br />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              style={{ width: "100%" }}
            />
            <br /><br />
            <input
              value={editAssignedTo}
              onChange={(e) => setEditAssignedTo(e.target.value)}
              style={{ width: "100%" }}
            />
            <br /><br />
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              style={{ width: "100%" }}
            />
            <br /><br />
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              style={{ width: "100%" }}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
            <br /><br />
            <button onClick={() => saveEdit(task)}>
              Save Changes
            </button>
          </>
        ) : (
          <>
            <h3 style={{ margin: "0 0 8px 0" }}>{task.title}</h3>
            <p style={{ margin: "0 0 12px 0" }}>{task.description}</p>

            <p style={{ margin: "4px 0" }}>
              <strong>Assigned To:</strong> {task.assignedTo || "N/A"}
            </p>

            <p style={{ margin: "4px 0" }}>
              <strong>Priority:</strong>{" "}
              <span className={getPriorityClass(task.priority)}>
                {task.priority}
              </span>
            </p>

            <p style={{ margin: "4px 0 12px 0" }}>
              <strong>Due Date:</strong>{" "}
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "Not Set"}
            </p>

            {isOverdue(task) && (
              <div style={{ marginBottom: "10px" }}>
                <span className="priority-critical" style={{ display: "inline-block", padding: "2px 6px", borderRadius: "4px" }}>
                  Overdue
                </span>
              </div>
            )}

            <select
              value={task.status || "Todo"}
              onChange={(e) => updateStatus(task, e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
            >
              <option>Todo</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>

            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => startEdit(task)} style={{ flex: 1 }}>Edit</button>
              <button onClick={() => deleteTask(task._id)} style={{ flex: 1 }}>Delete</button>
            </div>
          </>
        )}
      </div>
    );
  };

  // Inline styling object for the expanding column cards
  const columnStyle = {
    flex: 1,
    minWidth: "250px",
    height: "max-content",
    backgroundColor: "#f8fafc", 
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
  };

  return (
    <div className="page-container" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header bar with top-right search controls */}
      <div 
        className="card" 
        style={{ 
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px"
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Tasks</h1>
          <p style={{ color: "#64748b", marginTop: "4px", marginBottom: 0 }}>
            Manage, track and organize project tasks.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "6px 10px", fontSize: "14px", width: "180px" }}
          />

          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            style={{ padding: "6px 10px", fontSize: "14px", width: "120px" }}
          >
            {users.map((user) => (
              <option key={user}>
                {user}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task Creation Form */}
      <div className="form-card" style={{ marginBottom: "20px", padding: "20px", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
        <h2 style={{ margin: "0 0 15px 0" }}>Create Task</h2>
        <input
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginRight: "10px", marginBottom: "10px" }}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginRight: "10px", marginBottom: "10px", verticalAlign: "middle" }}
        />
        <input
          placeholder="Assigned To"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          style={{ marginRight: "10px", marginBottom: "10px" }}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ marginRight: "10px", marginBottom: "10px" }}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ marginRight: "10px", marginBottom: "10px", padding: "4px" }}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>
        <button onClick={createTask}>Create Task</button>
      </div>

      {/* Dynamic Task Board Layout */}
      <div className="task-board" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <div className="column" style={columnStyle}>
          <h2 style={{ margin: "0 0 15px 0", fontSize: "18px", borderBottom: "2px solid #e2e8f0", paddingBottom: "8px" }}>
            To do ({todoTasks.length})
          </h2>
          {todoTasks.map(renderTask)}
        </div>

        <div className="column" style={columnStyle}>
          <h2 style={{ margin: "0 0 15px 0", fontSize: "18px", borderBottom: "2px solid #e2e8f0", paddingBottom: "8px" }}>
            In Progress ({progressTasks.length})
          </h2>
          {progressTasks.map(renderTask)}
        </div>

        <div className="column" style={columnStyle}>
          <h2 style={{ margin: "0 0 15px 0", fontSize: "18px", borderBottom: "2px solid #e2e8f0", paddingBottom: "8px" }}>
            Done ({doneTasks.length})
          </h2>
          {doneTasks.map(renderTask)}
        </div>
      </div>
    </div>
  );
}

export default Tasks;