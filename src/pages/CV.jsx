import React from "react";

function CV() {
  return (
    <div className="cv-page">
      <h1>Profile</h1>

      <section className="profile-section">
        <h2>Shuang Xia</h2>
        <p>
          I’m a dedicated Information Technology student at York University with a passion for business analysis,
          data-driven decision-making, and automation. I bring a strong foundation in both technical and
          compliance-based domains, having supported audit processes and data reconciliation at organizations like the
          Toronto Transit Commission.
        </p>

        <p>
          <strong>Technical Background:</strong> Skilled in Python, SQL (MySQL/Oracle), Power BI, Excel, MongoDB,
          and cloud platforms such as Azure and Snowflake. I also hold certifications including the Google Data
          Analytics Professional Certificate and the Microsoft Power BI Data Analyst Associate (PL-300).
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

