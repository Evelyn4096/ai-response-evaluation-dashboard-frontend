import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import WebSocketBox from "../components/WebSocketBox";
import "./Project.css";

// === Auto select local / Render backend ===
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://four020project.onrender.com";

export default function Project() {
  const [stats, setStats] = useState([]);
  const [status, setStatus] = useState("");

  // Chart refs
  const accuracyRef = useRef(null);
  const timeRef = useRef(null);
  const correctWrongRef = useRef(null);
  const domainShareRef = useRef(null);
  const scatterRef = useRef(null);

  // Chart instances
  const accuracyChart = useRef(null);
  const timeChart = useRef(null);
  const correctWrongChart = useRef(null);
  const domainShareChart = useRef(null);
  const scatterChart = useRef(null);

  // ----------------------------
  // Fetch analysis stats
  // ----------------------------
  async function fetchStats() {
    try {
      const res = await fetch(`${API_BASE}/api/analysis`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching analysis:", err);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  // ----------------------------
  // KPI values
  // ----------------------------
  const totalQuestions = stats.reduce((sum, s) => sum + (s.count || 0), 0);

  const overallAccuracy =
    stats.length === 0
      ? 0
      : stats.reduce((sum, s) => sum + s.accuracy * s.count, 0) /
          totalQuestions || 0;

  const fastestDomain =
    stats.length === 0
      ? null
      : stats.reduce(
          (best, s) =>
            !best || s.avgResponseTime < best.avgResponseTime ? s : best,
          null
        );

  // ----------------------------
  // Render Charts on stats change
  // ----------------------------
  useEffect(() => {
    if (stats.length === 0) return;

    const domains = stats.map((s) => s.domain);
    const accuracies = stats.map((s) => s.accuracy);
    const responseTimes = stats.map((s) => s.avgResponseTime);
    const counts = stats.map((s) => s.count || 0);
    const correctCounts = stats.map((s) =>
      Math.round(s.accuracy * (s.count || 0))
    );
    const incorrectCounts = stats.map(
      (s, i) => (s.count || 0) - correctCounts[i]
    );

    // Destroy old charts
    if (accuracyChart.current) accuracyChart.current.destroy();
    if (timeChart.current) timeChart.current.destroy();
    if (correctWrongChart.current) correctWrongChart.current.destroy();
    if (domainShareChart.current) domainShareChart.current.destroy();
    if (scatterChart.current) scatterChart.current.destroy();

    // Accuracy Bar
    accuracyChart.current = new Chart(accuracyRef.current, {
      type: "bar",
      data: {
        labels: domains,
        datasets: [{ label: "Accuracy", data: accuracies }],
      },
      options: { scales: { y: { beginAtZero: true, max: 1 } } },
    });

    // Response Time Line
    timeChart.current = new Chart(timeRef.current, {
      type: "line",
      data: {
        labels: domains,
        datasets: [
          { label: "Avg Response Time (ms)", data: responseTimes, tension: 0.25 },
        ],
      },
      options: { scales: { y: { beginAtZero: true } } },
    });

    // Correct vs Incorrect
    correctWrongChart.current = new Chart(correctWrongRef.current, {
      type: "bar",
      data: {
        labels: domains,
        datasets: [
          { label: "Correct", data: correctCounts },
          { label: "Incorrect", data: incorrectCounts },
        ],
      },
      options: {
        responsive: true,
        scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } },
      },
    });

    // Domain distribution
    domainShareChart.current = new Chart(domainShareRef.current, {
      type: "doughnut",
      data: {
        labels: domains,
        datasets: [{ label: "Question Count", data: counts }],
      },
    });

    // Scatter (accuracy vs response time)
    scatterChart.current = new Chart(scatterRef.current, {
      type: "scatter",
      data: {
        datasets: stats.map((s) => ({
          label: s.domain,
          data: [{ x: s.avgResponseTime, y: s.accuracy }],
        })),
      },
      options: {
        scales: {
          x: { title: { display: true, text: "Avg Response Time (ms)" } },
          y: { max: 1, beginAtZero: true },
        },
      },
    });
  }, [stats]);

  // ----------------------------
  // Backend Control Buttons
  // ----------------------------
  async function startEvaluation() {
    setStatus("Starting evaluation...");
    try {
      const res = await fetch(`${API_BASE}/api/evaluations/start`, {
        method: "POST",
      });
      const data = await res.json();
      setStatus(data.status);
    } catch {
      setStatus("Error: backend unreachable.");
    }
  }
  
  async function quickEvaluation() {
  setStatus("Starting quick evaluation...");
  try {
    const res = await fetch(`${API_BASE}/api/evaluations/quick`, {
      method: "POST",
    });
    const data = await res.json();
    setStatus(data.status);
  } catch {
    setStatus("Error: backend unreachable.");
  }
}

  async function pauseEvaluation() {
    const res = await fetch(`${API_BASE}/api/evaluations/pause`, {
      method: "POST",
    });
    const data = await res.json();
    setStatus(data.status);
  }

  async function resumeEvaluation() {
    const res = await fetch(`${API_BASE}/api/evaluations/resume`, {
      method: "POST",
    });
    const data = await res.json();
    setStatus(data.status);
  }

  async function resetEvaluation() {
    setStatus("Resetting...");
    const res = await fetch(`${API_BASE}/api/evaluations/reset`, {
      method: "POST",
    });
    const data = await res.json();
    setStatus(data.status);

    await fetchStats(); // refresh charts
  }

  // ----------------------------

  return (
    <div className="project-page">
      <h1>Gemini Evaluation Dashboard</h1>

      {/* KPI SUMMARY */}
      <div className="kpi-row">
        <div className="kpi-card">
          <h3>Total Questions</h3>
          <p>{totalQuestions}</p>
        </div>
        <div className="kpi-card">
          <h3>Overall Accuracy</h3>
          <p>{(overallAccuracy * 100).toFixed(1)}%</p>
        </div>
        <div className="kpi-card">
          <h3>Fastest Domain</h3>
          <p>
            {fastestDomain
              ? `${fastestDomain.domain} (${Math.round(
                  fastestDomain.avgResponseTime
                )} ms)`
              : "—"}
          </p>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="button-row">
        <button className="quick-btn" onClick={quickEvaluation}>Quick</button>
        <button className="start-btn" onClick={startEvaluation}>Start</button>
        <button className="pause-btn" onClick={pauseEvaluation}>Pause</button>
        <button className="resume-btn" onClick={resumeEvaluation}>Resume</button>
        <button className="reset-btn" onClick={resetEvaluation}>Reset</button>
      </div>

      <p className="status-text">{status}</p>

      {/* WebSocket Real-time Log */}
      <h2>Live Evaluation Progress</h2>
      <WebSocketBox />

      <h2>Results</h2>

      <div className="dashboard-grid">
        <div className="chart-section">
          <h3>Accuracy per Domain</h3>
          <canvas ref={accuracyRef}></canvas>
        </div>

        <div className="chart-section">
          <h3>Avg Response Time per Domain</h3>
          <canvas ref={timeRef}></canvas>
        </div>

        <div className="chart-section">
          <h3>Correct vs Incorrect</h3>
          <canvas ref={correctWrongRef}></canvas>
        </div>

        <div className="chart-section">
          <h3>Question Distribution</h3>
          <canvas ref={domainShareRef}></canvas>
        </div>

        <div className="chart-section">
          <h3>Accuracy vs Response Time</h3>
          <canvas ref={scatterRef}></canvas>
        </div>
      </div>

      <button className="refresh-btn" onClick={fetchStats}>
        Refresh Results
      </button>
    </div>
  );
}
