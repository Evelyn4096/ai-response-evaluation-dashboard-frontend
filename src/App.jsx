import { useState, useEffect } from "react";
import "./App.css";

import Home from "./pages/Home";
import CV from "./pages/CV";
import Project from "./pages/Project";
import Assistant from "./components/Assistant";

export default function App() {
  const [route, setRoute] = useState(window.location.hash);

  const routes = {
    "": <Home />,
    "#": <Home />,
    "#home": <Home />,
    "#cv": <CV />,
    "#project": <Project />,
  };

  useEffect(() => {
    const handler = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const page = routes[route] || <Home />;

  return (
    <div className="app-container">

      {/* Navigation */}
      <nav className="navbar">
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#cv">CV</a></li>
          <li><a href="#project">Project</a></li>
        </ul>
      </nav>

      {/* Main content */}
      <main className="main-content">
        {page}
      </main>

      {/* Optional Assistant */}
      <Assistant />
    </div>
  );
}
