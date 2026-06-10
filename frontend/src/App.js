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
            element={<Dashboard />}
          />

          <Route
            path="/tasks"
            element={<Tasks />}
          />
          <Route
  path="/projects"
  element={<Projects />}
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