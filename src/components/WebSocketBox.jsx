// src/components/WebSocketBox.jsx

import { useEffect, useState, useRef } from "react";
import "./WebSocketBox.css";

export default function WebSocketBox() {
  const [messages, setMessages] = useState([]);
  const boxRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      setMessages((prev) => [...prev, "📡 WebSocket connected"]);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.done) {
          setMessages((prev) => [...prev, "✅ Evaluation finished"]);
        } else {
          setMessages((prev) => [
            ...prev,
            `📘 ${msg.domain}: "${msg.question}" → ${msg.answer} (${msg.responseTime} ms)`
          ]);
        }
      } catch (err) {
        console.error("Invalid WS message:", err);
      }
    };

    ws.onclose = () => {
      setMessages((prev) => [...prev, "🔌 WebSocket disconnected"]);
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
          <div key={i} className="ws-line">
            {m}
          </div>
        ))}
      </div>
    </div>
  );
}
