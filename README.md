# AI Response Evaluation Dashboard – Frontend

This repository contains the frontend implementation of the **AI Response Evaluation Dashboard**, a web-based system for visualizing and analyzing the performance of AI-generated responses across multiple domains.

The frontend focuses on **user interaction and data visualization**, providing real-time control over the evaluation process and intuitive insight into accuracy and response-time metrics.

---

## Features

- Interactive dashboard displaying:
  - Total evaluated questions
  - Overall accuracy
  - Fastest response domain
- Real-time evaluation controls:
  - Start, pause, resume, and reset
- Visualization of evaluation results:
  - Accuracy per domain
  - Correct vs. incorrect distribution
  - Accuracy vs. response time trade-offs
- Responsive, component-based UI

---

## Tech Stack

- **React**
- **JavaScript (ES6+)**
- **Vite**
- **Chart.js**
- **CSS**

---

## Project Structure

```text
src/
├── components/        # Reusable UI components
├── pages/             # Page-level components (Home, CV, Project)
├── App.jsx            # Application entry
├── main.jsx           # React bootstrap

Deployment

The frontend is deployed on Render:

👉 Live Demo:
https://evelyn4096-github-io.onrender.com

Backend Integration

This frontend communicates with a separate backend service via REST APIs.

Backend repository:
https://github.com/Evelyn4096/ai-response-evaluation-dashboard-backend

Notes

This project is part of an academic and personal portfolio, emphasizing system design, frontend–backend separation, and applied AI evaluation, rather than model training.
