import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import WebSocketBox from "../components/WebSocketBox";
import "./Project.css";

export default function Project() {
  const [stats, setStats] = useState([]);
  const [status, setStatus] = useState("");

  const accuracyRef = useRef(null);
  const timeRef = useRef(null);
  const combinedRef = useRef(null);

  const accuracyChart = useRef(null);
  const timeChart = useRef(null);
  const combinedChart = useRef(null);

  // ----------------------------
  // Fetch analysis stats
  // ----------------------------
  async function fetchStats() {
    try {
      const res = await fetch("http://localhost:3000/api/analysis");
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
  // Render Charts When stats Change
  // ----------------------------
  useEffect(() => {
    if (stats.length === 0) return;

    const domains = stats.map(s => s.domain);
    const accuracies = stats.map(s => s.accuracy);
    const responseTimes = stats.map(s => s.avgResponseTime);

    // Destroy old charts first
    if (accuracyChart.current) accuracyChart.current.destroy();
    if (timeChart.current) timeChart.current.destroy();
    if (combinedChart.current) combinedChart.current.destroy();

    // --- Accuracy Bar Chart ---
    accuracyChart.current = new Chart(accuracyRef.current, {
      type: "bar",
      data: {
        labels: domains,
        datasets: [
          {
            label: "Accuracy (0~1)",
            data: accuracies,
            backgroundColor: "rgba(75, 192, 192, 0.7)",
          },
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true, max: 1 },
        },
      },
    });

    // --- Response Time Line Chart ---
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

    // --- Combined Summary Dashboard ---
    combinedChart.current = new Chart(combinedRef.current, {
      type: "radar",
      data: {
        labels: domains,
        datasets: [
          {
            label: "Accuracy",
            data: accuracies,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgb(54, 162, 235)",
            borderWidth: 2,
          },
          {
            label: "Response Time (scaled 0-1)",
            data: responseTimes.map(t => t / Math.max(...responseTimes)),
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgb(255, 99, 132)",
            borderWidth: 2,
          }
        ],
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 1
          }
        }
      }
    });

  }, [stats]);


  // ----------------------------
  // Start Evaluation (POST)
  // ----------------------------
  async function startEvaluation() {
    setStatus("Starting evaluation...");

    try {
      const res = await fetch("http://localhost:3000/api/evaluations/start", {
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
      <h1>ChatGPT Evaluation Dashboard</h1>

      {/* Start evaluation */}
      <button className="start-btn" onClick={startEvaluation}>
        Start Evaluation
      </button>

      <p className="status-text">{status}</p>

      {/* WebSocket Real-time Log */}
      <h2>Live Evaluation Progress</h2>
      <WebSocketBox />

      {/* RESULTS SECTION */}
      <h2>Results</h2>
      <p>
        Below are the evaluation results including accuracy, response time, and a combined summary dashboard.
      </p>

      {/* Accuracy Chart */}
      <div className="chart-section">
        <h3>Accuracy per Domain</h3>
        <canvas ref={accuracyRef} height={260}></canvas>
      </div>

      {/* Response Time Chart */}
      <div className="chart-section">
        <h3>Avg Response Time per Domain</h3>
        <canvas ref={timeRef} height={260}></canvas>
      </div>

      {/* Combined Summary (Radar) */}
      <div className="chart-section">
        <h3>Combined Summary Dashboard</h3>
        <canvas ref={combinedRef} height={300}></canvas>
      </div>

      <button className="refresh-btn" onClick={fetchStats}>
        Refresh Results
      </button>
    </div>
  );
}
