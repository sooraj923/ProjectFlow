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

  const [commentInputs, setCommentInputs] = useState({});

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
        priority
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

  const addComment = async (taskId) => {
    try {
      const message = commentInputs[taskId];

      if (!message) return;

      await api.post(`/tasks/${taskId}/comment`, {
        author: "Sooraj",
        message
      });

      setCommentInputs({
        ...commentInputs,
        [taskId]: ""
      });

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
      task.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      task.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

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
    const isEditing =
      editingTask === task._id;

    return (
      <div
        key={task._id}
        className="task-card"
      >
        {isEditing ? (
          <>
            <input
              value={editTitle}
              onChange={(e) =>
                setEditTitle(e.target.value)
              }
            />

            <br /><br />

            <textarea
              value={editDescription}
              onChange={(e) =>
                setEditDescription(e.target.value)
              }
            />

            <br /><br />

            <input
              value={editAssignedTo}
              onChange={(e) =>
                setEditAssignedTo(e.target.value)
              }
            />

            <br /><br />

            <input
              type="date"
              value={editDueDate}
              onChange={(e) =>
                setEditDueDate(e.target.value)
              }
            />

            <br /><br />

            <select
              value={editPriority}
              onChange={(e) =>
                setEditPriority(e.target.value)
              }
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>

            <br /><br />

            <button
              onClick={() =>
                saveEdit(task)
              }
            >
              Save Changes
            </button>
          </>
        ) : (
          <>
            <h3>{task.title}</h3>

            <p>{task.description}</p>

            <br />

            <p>
              <strong>Assigned To:</strong>{" "}
              {task.assignedTo || "N/A"}
            </p>

            <p>
              <strong>Priority:</strong>{" "}
              <span
                className={getPriorityClass(
                  task.priority
                )}
              >
                {task.priority}
              </span>
            </p>

            <p>
              <strong>Due Date:</strong>{" "}
              {task.dueDate
                ? new Date(
                    task.dueDate
                  ).toLocaleDateString()
                : "Not Set"}
            </p>

            {isOverdue(task) && (
              <span className="priority-critical">
  Overdue
</span>
            )}

            <br />

            <select
              value={task.status}
              onChange={(e) =>
                updateStatus(
                  task,
                  e.target.value
                )
              }
            >
              <option>Todo</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>

            <br /><br />

            <button
              onClick={() =>
                startEdit(task)
              }
            >
              Edit
            </button>

            {" "}

            <button
              onClick={() =>
                deleteTask(task._id)
              }
            >
              Delete
            </button>
          </>
        )}

     <hr style={{ margin: "15px 0" }} />

<h4>
  Comments ({task.comments?.length || 0})
</h4>

{task.comments?.map(
  (comment, index) => (
    <div
      key={index}
      style={{
        marginBottom: "10px"
      }}
    >
      <strong>
        {comment.author}
      </strong>

      <p>{comment.message}</p>

      <small>
        {new Date(
          comment.createdAt
        ).toLocaleString()}
      </small>
    </div>
  )
)}

<input
  placeholder="Add comment"
  value={
    commentInputs[task._id] || ""
  }
  onChange={(e) =>
    setCommentInputs({
      ...commentInputs,
      [task._id]:
        e.target.value
    })
  }
/>

<br /><br />

<button
  onClick={() =>
    addComment(task._id)
  }
>
  Add Comment
</button>
      </div>
    );
  };

  return (
    <div className="page-container">
        <div
  className="card"
  style={{
    marginBottom: "20px"
  }}
>
  <h1>Tasks</h1>

  <p
    style={{
      color: "#64748b",
      marginTop: "8px"
    }}
  >
    Manage, track and organize project tasks.
  </p>
</div>
      <h1
        style={{
          marginBottom: "20px"
        }}
      >
        Task Management
      </h1>

      <div className="form-card">
        <h2>Create Task</h2>

        <br />

        <input
          placeholder="Task Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <br /><br />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <br /><br />

        <input
          placeholder="Assigned To"
          value={assignedTo}
          onChange={(e) =>
            setAssignedTo(e.target.value)
          }
        />

        <br /><br />

        <input
          type="date"
          value={dueDate}
          onChange={(e) =>
            setDueDate(e.target.value)
          }
        />

        <br /><br />

        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
          }
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>

        <br /><br />

        <button onClick={createTask}>
          Create Task
        </button>
      </div>

      <div className="form-card">
        <input
          placeholder="Search Tasks"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

        <br /><br />

        <select
          value={filterUser}
          onChange={(e) =>
            setFilterUser(e.target.value)
          }
        >
          {users.map((user) => (
            <option key={user}>
              {user}
            </option>
          ))}
        </select>
      </div>

      <div className="task-board">
        <div className="column">
          <h2>
            Todo ({todoTasks.length})
          </h2>

          {todoTasks.map(renderTask)}
        </div>

        <div className="column">
          <h2>
            In Progress ({progressTasks.length})
          </h2>

          {progressTasks.map(renderTask)}
        </div>

        <div className="column">
          <h2>
            Done ({doneTasks.length})
          </h2>

          {doneTasks.map(renderTask)}
        </div>
      </div>
    </div>
  );
}

export default Tasks;