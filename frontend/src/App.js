import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import Navbar from "./components/Navbar";
import Projects from "./pages/Projects";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function Layout() {
  const location = useLocation();

  const authPages =
    location.pathname === "/" ||
    location.pathname === "/register";

  return (
    <>
      {!authPages && <Navbar />}

      <div
        className={
          authPages
            ? ""
            : "main-content"
        }
      >
        <Routes>
  <Route
    path="/"
    element={<Login />}
  />

  <Route
    path="/register"
    element={<Register />}
  />

  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/tasks"
    element={
      <ProtectedRoute>
        <Tasks />
      </ProtectedRoute>
    }
  />

  <Route
    path="/projects"
    element={
      <ProtectedRoute>
        <Projects />
      </ProtectedRoute>
    }
  />
</Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;