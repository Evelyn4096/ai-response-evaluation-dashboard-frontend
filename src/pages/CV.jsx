import React from "react";

function CV() {
  return (
    <div className="cv-page">
    <section>
      <h1>Profile</h1>
      <h2>Tianzhuo li</h2>
        <p>I’m an Information Technology student at York University with a strong focus on full-stack development,
  system design, and AI-driven applications. I enjoy building practical and user-centered tools, from
  evaluation platforms powered by real-time data to interactive game systems and cloud-based services.</p>
        
        <p>
  <strong>Technical Background:</strong> Experienced with Python, Java, JavaScript/Node.js, React, MongoDB,
  Express, and cloud platforms such as Render and Cloudflare. I also work extensively with systems design,
  REST APIs, WebSockets, and machine-learning model integration for applied projects in cybersecurity and 
  automation.
</p>

        <button
          onClick={() => window.open("/CV.pdf", "_blank")}
          style={{
            marginTop: "1rem",
            padding: "10px 20px",
            backgroundColor: "#3f51b5",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          View Full CV (PDF)
        </button>
      </section>
    </div>
  );
}

export default CV;

