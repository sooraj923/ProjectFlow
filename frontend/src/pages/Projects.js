import { useEffect, useState } from "react";
import api from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] =
  useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] =
  useState(null);

const [editName, setEditName] =
  useState("");
  

const [editDescription, setEditDescription] =
  useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createProject = async () => {
    try {
      if (!name.trim()) {
        alert("Project name is required");
        return;
      }

      await api.post("/projects", {
        name,
        description
      });

      setName("");
      setDescription("");

      loadProjects();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProject = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/projects/${id}`);
      loadProjects();
    } catch (error) {
      console.log(error);
    }
  };
  const startEdit = (project) => {
  setEditingProject(project._id);

  setEditName(project.name);

  setEditDescription(
    project.description || ""
  );
};

const saveEdit = async (id) => {
  try {
    await api.put(`/projects/${id}`, {
      name: editName,
      description: editDescription
    });

    setEditingProject(null);

    loadProjects();
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="page-container">
      <div
        className="card"
        style={{
          marginBottom: "20px"
        }}
      >
        <h1>Projects</h1>

        <p
          style={{
            color: "#64748b",
            marginTop: "8px"
          }}
        >
          Manage and organize project information.
        </p>
      </div>

      <div className="form-card">
  <button
    onClick={() =>
      setShowForm(!showForm)
    }
  >
    {showForm
      ? "Hide Form"
      : "New Project"}
  </button>

  {showForm && (
    <>
        <h2
          style={{
            marginBottom: "15px"
          }}
        >
          New Project
        </h2>

        <input
          placeholder="Project Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <br />
        <br />

        <textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <br />
        <br />

        <button
          onClick={createProject}
        >
          Create Project
        </button>
          </>
  )}
</div>
      <div
  className="form-card"
  style={{
    marginBottom: "20px"
  }}
>
  <input
    placeholder="Search Projects"
    value={searchTerm}
    onChange={(e) =>
      setSearchTerm(e.target.value)
    }
  />
</div>

      <div
        style={{
          display: "grid",
          gap: "15px"
        }}
      >
        {projects
  .filter((project) =>
    project.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )
  .map((project) => (
    <div
      key={project._id}
      className="card"
      style={{
        borderLeft: "4px solid #2563eb",
        cursor: "pointer"
      }}
      
    >
      <h3
  style={{
    marginBottom: "10px"
  }}
>
  {project.name}
</h3>

<p
  style={{
    color: "#64748b",
    marginBottom: "15px"
  }}
>
  {project.description ||
    "No description provided"}
</p>

<p
  style={{
    fontSize: "13px",
    color: "#94a3b8",
    marginBottom: "15px"
  }}
>
  ID: {project._id.slice(-6)}
</p>

<div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  }}
>
  <button
    onClick={() =>
      setSelectedProject(project)
    }
  >
    View Details
  </button>

  <button
    onClick={(e) => {
      e.stopPropagation();
      deleteProject(project._id);
    }}
    style={{
      background: "#dc2626"
    }}
  >
    Delete
  </button>
</div>
    </div>
  ))}
        
      </div>
      {selectedProject && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}
  >
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        width: "500px",
        maxWidth: "90%"
      }}
    >
      <h2>
        {selectedProject.name}
      </h2>

      <br />

      <p>
        <strong>Description</strong>
      </p>

      <p>
        {selectedProject.description ||
          "No description available"}
      </p>

      <br />

      <p>
        <strong>Project ID</strong>
      </p>

      <p>
        {selectedProject._id}
      </p>

      <br />

      <button
        onClick={() =>
          setSelectedProject(null)
        }
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
}

export default Projects;