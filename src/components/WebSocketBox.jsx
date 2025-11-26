// src/components/WebSocketBox.jsx

import { useEffect, useState, useRef } from "react";
import "./WebSocketBox.css";

export default function WebSocketBox() {
  const [messages, setMessages] = useState([]);
  const boxRef = useRef(null);

  useEffect(() => {
    const WS_URL =
      window.location.hostname === "localhost"
        ? "ws://localhost:5000/ws"
        : "wss://four020project.onrender.com/ws";

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      setMessages(prev => [...prev, "📡 WebSocket connected"]);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        // === Handle control messages ===
        if (msg.status) {
          switch (msg.status) {
            case "paused":
              setMessages(prev => [...prev, "⏸ Evaluation Paused"]);
              return;

            case "resumed":
              setMessages(prev => [...prev, "▶ Evaluation Resumed"]);
              return;

            case "stopped":
              setMessages(prev => [...prev, "🛑 Evaluation Stopped"]);
              return;

            case "reset":
              // 💥 Clear log on reset
              setMessages([]);
              return;

            case "reset-complete":
              setMessages(prev => [...prev, "🔄 Reset Complete"]);
              return;

            case "done":
              setMessages(prev => [...prev, "✅ Evaluation Finished"]);
              return;
          }
        }

        // --- Normal evaluation message ---
        if (msg.domain && msg.answer != null) {
          setMessages(prev => [
            ...prev,
            `📘 ${msg.domain}: "${msg.question}" → ${msg.answer} (${msg.responseTime} ms)`
          ]);
        }

      } catch (err) {
        console.error("Invalid WS message:", err);
        setMessages(prev => [...prev, "❌ Error parsing message"]);
      }
    };

    ws.onclose = () => {
      setMessages(prev => [...prev, "🔌 WebSocket disconnected"]);
    };

    return () => ws.close();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="ws-container">
      <h3>Live Evaluation Log</h3>
      <div className="ws-box" ref={boxRef}>
        {messages.map((m, i) => (
          <div key={i} className="ws-line">{m}</div>
        ))}
      </div>
    </div>
  );
}
