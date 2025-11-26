export default function Home() {
  return (
    <section className="home-page">
      
      {/* Header Section */}
      <div className="home-header">
        <h1 className="title">E & A's Portfolio</h1>
      </div>

      {/* Intro Section */}
      <div className="intro-section">
        <h2>Intro</h2>
        <p>
          This portfolio presents a fully customized multi-page website designed for the 
          course project. It integrates modern front-end development with a backend-driven 
          AI evaluation system. The goal is to measure Gemini’s accuracy and response 
          efficiency across three academic domains: <strong>History</strong>, 
          <strong> Social Science</strong>, and <strong>Computer Security</strong>.
        </p>

        <p>
          Using React, hash-based routing, interactive UI components, and a real-time 
          WebSocket-powered backend, this website demonstrates both technical proficiency 
          and thoughtful design. Navigate through the sections above to explore my 
          background, project methodology, datasets, and the evaluation dashboard.
        </p>
      </div>

      {/* Project Overview */}
      <div className="overview-section">
        <h2>What This Project Includes</h2>
        <p>
          This project was designed to meet the course requirements while showcasing 
          advanced concepts in web development and AI integration. The system performs 
          automated evaluation by sending dataset questions to the Gemini, storing 
          results in MongoDB, and analyzing the model’s overall performance.
        </p>

        <ul className="overview-list">
          <li>✓ Personalized multi-page portfolio layout</li>
          <li>✓ Client-side routing using hash navigation</li>
          <li>✓ Interactive animated assistant character</li>
          <li>✓ Express.js middleware & sample API endpoint</li>
          <li>✓ Real-time server communication via WebSocket</li>
          <li>✓ Evaluation dashboard using Chart.js </li>
          <li>✓ Fully responsive and professional UI design</li>
        </ul>
      </div>

      {/* CTA */}
      <div className="cta-section">
        <a href="#project" className="cta-button">
          Explore the Gemini Evaluation →
        </a>
      </div>
    </section>
  );
}
