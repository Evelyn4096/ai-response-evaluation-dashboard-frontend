import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import WebSocketBox from "../components/WebSocketBox";
import "./Project.css";

// === Auto select local / Render backend ===
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://four020project.onrender.com";

export default function Project() {
  const [stats, setStats] = useState([]);
  const [status, setStatus] = useState("");

  // Chart canvas refs
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
  // Render Charts When stats Change
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

    accuracyChart.current = new Chart(accuracyRef.current, {
      type: "bar",
      data: {
        labels: domains,
        datasets: [
          {
            label: "Accuracy (0–1)",
            data: accuracies,
          },
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true, max: 1 },
        },
      },
    });

    timeChart.current = new Chart(timeRef.current, {
      type: "line",
      data: {
        labels: domains,
        datasets: [
          {
            label: "Avg Response Time (ms)",
            data: responseTimes,
            borderWidth: 2,
            tension: 0.25,
          },
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

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
        scales: {
          x: { stacked: true },
          y: { beginAtZero: true, stacked: true },
        },
      },
    });

    domainShareChart.current = new Chart(domainShareRef.current, {
      type: "doughnut",
      data: {
        labels: domains,
        datasets: [
          {
            label: "Question Count",
            data: counts,
          },
        ],
      },
    });

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
          x: {
            title: { display: true, text: "Avg Response Time (ms)" },
            beginAtZero: true,
          },
          y: {
            title: { display: true, text: "Accuracy (0–1)" },
            beginAtZero: true,
            max: 1,
          },
        },
      },
    });
  }, [stats]);

  // ----------------------------
  // Start Evaluation (POST)
  // ----------------------------
  async function startEvaluation() {
    setStatus("Starting evaluation...");

    try {
      const res = await fetch(`${API_BASE}/api/evaluations/start`, {
        method: "POST",
      });
      const data = await res.json();
      setStatus(data.status || "Evaluation started.");
    } catch (err) {
      console.error(err);
      setStatus("Error: backend unreachable.");
    }
  }

  return (
    <div className="project-page">
      <h1>Gemini Evaluation Dashboard</h1>

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

      <button className="start-btn" onClick={startEvaluation}>
        Start Evaluation
      </button>
      <p className="status-text">{status}</p>

      <h2>Live Evaluation Progress</h2>
      <WebSocketBox />

      <h2>Results</h2>

      <div className="dashboard-grid">
        <div className="chart-section">
          <h3>Accuracy per Domain</h3>
          <canvas ref={accuracyRef} height={240}></canvas>
        </div>

        <div className="chart-section">
          <h3>Avg Response Time per Domain</h3>
          <canvas ref={timeRef} height={240}></canvas>
        </div>

        <div className="chart-section">
          <h3>Correct vs Incorrect per Domain</h3>
          <canvas ref={correctWrongRef} height={260}></canvas>
        </div>

        <div className="chart-section">
          <h3>Question Distribution by Domain</h3>
          <canvas ref={domainShareRef} height={260}></canvas>
        </div>

        <div className="chart-section">
          <h3>Accuracy vs Response Time</h3>
          <canvas ref={scatterRef} height={260}></canvas>
        </div>
      </div>

      <button className="refresh-btn" onClick={fetchStats}>
        Refresh Results
      </button>
    </div>
  );
}
