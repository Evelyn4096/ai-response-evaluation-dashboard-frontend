
import { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);
import { Bar, Line, Doughnut, Scatter } from "react-chartjs-2";
import WebSocketBox from "../components/WebSocketBox";
import "./Project.css";

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://four020project.onrender.com";

/* ============================
   SMALL INLINE COMPONENTS
============================ */
function KPICard({ title, value }) {
  return (
    <div className="kpi-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}

function ControlButtons({ onQuick, onStart, onPause, onResume, onReset }) {
  return (
    <div className="button-row">
      <button className="quick-btn" onClick={onQuick}>
        Quick
      </button>
      <button className="start-btn" onClick={onStart}>
        Start
      </button>
      <button className="pause-btn" onClick={onPause}>
        Pause
      </button>
      <button className="resume-btn" onClick={onResume}>
        Resume
      </button>
      <button className="reset-btn" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}

/* ============================
   MAIN PAGE COMPONENT
============================ */
export default function Project() {
  const [stats, setStats] = useState([]);
  const [status, setStatus] = useState("");

  /* ----------------------------
     Fetch Stats
  ---------------------------- */
  async function fetchStats() {
    try {
      const res = await fetch(`${API_BASE}/api/analysis`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  /* ----------------------------
     KPI VALUES (useMemo)
  ---------------------------- */
  const totalQuestions = useMemo(
    () => stats.reduce((sum, s) => sum + (s.count || 0), 0),
    [stats]
  );

  const overallAccuracy = useMemo(() => {
    if (!stats.length) return 0;
    return (
      stats.reduce(
        (sum, s) => sum + s.accuracy * (s.count || 0),
        0
      ) / totalQuestions
    );
  }, [stats, totalQuestions]);

  const fastestDomain = useMemo(() => {
    if (!stats.length) return null;
    return stats.reduce(
      (best, s) =>
        !best || s.avgResponseTime < best.avgResponseTime ? s : best,
      null
    );
  }, [stats]);

  /* ----------------------------
     CHART DATA GENERATORS
  ---------------------------- */
  const accuracyData = useMemo(
    () => ({
      labels: stats.map((s) => s.domain),
      datasets: [
        {
          label: "Accuracy",
          data: stats.map((s) => s.accuracy),
          backgroundColor: "#4e79ff"
        }
      ]
    }),
    [stats]
  );

  const timeData = useMemo(
    () => ({
      labels: stats.map((s) => s.domain),
      datasets: [
        {
          label: "Avg Response Time (ms)",
          data: stats.map((s) => s.avgResponseTime),
          borderColor: "#ff6c4e",
          backgroundColor: "rgba(255,108,78,0.3)",
          tension: 0.25
        }
      ]
    }),
    [stats]
  );

  const correctWrongData = useMemo(() => {
    const counts = stats.map((s) => s.count || 0);
    const correct = stats.map((s, i) =>
      Math.round(s.accuracy * counts[i])
    );
    const incorrect = stats.map((s, i) => counts[i] - correct[i]);

    return {
      labels: stats.map((s) => s.domain),
      datasets: [
        {
          label: "Correct",
          data: correct,
          backgroundColor: "#28a745"
        },
        {
          label: "Incorrect",
          data: incorrect,
          backgroundColor: "#dc3545"
        }
      ]
    };
  }, [stats]);

  const domainShareData = useMemo(
    () => ({
      labels: stats.map((s) => s.domain),
      datasets: [
        {
          label: "Question Count",
          data: stats.map((s) => s.count),
          backgroundColor: ["#4e79ff", "#ff6c4e", "#8e44ad", "#28a745"]
        }
      ]
    }),
    [stats]
  );

  const scatterData = useMemo(
    () => ({
      datasets: stats.map((s) => ({
        label: s.domain,
        data: [{ x: s.avgResponseTime, y: s.accuracy }],
        backgroundColor: "#5561d4"
      }))
    }),
    [stats]
  );

  /* ----------------------------
     CONTROL BUTTON ACTIONS
  ---------------------------- */
  const POST = async (path) => {
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method: "POST"
      });
      const data = await res.json();
      setStatus(data.status);
      return data;
    } catch (error) {
      setStatus("Error: backend unreachable.");
    }
  };

  const onQuick = () => POST("/api/evaluations/quick");
  const onStart = () => POST("/api/evaluations/start");
  const onPause = () => POST("/api/evaluations/pause");
  const onResume = () => POST("/api/evaluations/resume");
  const onReset = async () => {
    await POST("/api/evaluations/reset");
    await fetchStats();
  };

  /* ----------------------------
     RENDER UI
  ---------------------------- */
  return (
    <div className="project-page">
      <h1>Gemini Evaluation Dashboard</h1>

      {/* KPI SUMMARY */}
      <div className="kpi-row">
        <KPICard title="Total Questions" value={totalQuestions} />
        <KPICard
          title="Overall Accuracy"
          value={(overallAccuracy * 100).toFixed(1) + "%"}
        />
        <KPICard
          title="Fastest Domain"
          value={
            fastestDomain
              ? `${fastestDomain.domain} (${Math.round(
                  fastestDomain.avgResponseTime
                )} ms)`
              : "—"
          }
        />
      </div>

      {/* CONTROL BUTTONS */}
      <ControlButtons
        onQuick={onQuick}
        onStart={onStart}
        onPause={onPause}
        onResume={onResume}
        onReset={onReset}
      />
      <p className="status-text">{status}</p>

      {/* REAL-TIME LOG */}
      <h2>Live Evaluation Progress</h2>
      <WebSocketBox />

      {/* CHARTS */}
      <h2>Results</h2>
      <div className="dashboard-grid">
        <div className="chart-section">
          <h3>Accuracy per Domain</h3>
          <Bar data={accuracyData} />
        </div>

        <div className="chart-section">
          <h3>Avg Response Time</h3>
          <Line data={timeData} />
        </div>

        <div className="chart-section">
          <h3>Correct vs Incorrect</h3>
          <Bar data={correctWrongData} />
        </div>

        <div className="chart-section">
          <h3>Question Distribution</h3>
          <Doughnut data={domainShareData} />
        </div>

        <div className="chart-section">
          <h3>Accuracy vs Response Time</h3>
          <Scatter data={scatterData} />
        </div>
      </div>

      <button className="refresh-btn" onClick={fetchStats}>
        Refresh Results
      </button>
    </div>
  );
}
