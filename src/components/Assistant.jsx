import { useState, useEffect } from "react";
import "./Assistant.css";

export default function Assistant() {
  const tips = [
    "Welcome! I'm your guide for this portfolio.",
    "This project evaluates Gemini's accuracy and speed.",
    "Datasets include History, Social Science, and Computer Security.",
    "Try navigating using the bar above!",
    "Real-time updates are powered by WebSockets.",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % tips.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="assistant-box">
      <div className="assistant-avatar">🤖</div>
      <div className="assistant-text">{tips[index]}</div>
    </div>
  );
}
