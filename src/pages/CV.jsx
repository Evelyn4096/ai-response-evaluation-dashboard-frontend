export default function CV() {
  return (
    <section className="cv-page">
      <h1>Curriculum Vitae</h1>

      <iframe
        src="/cv.pdf"
        width="100%"
        height="800px"
        style={{ border: "none" }}
        title="CV PDF Viewer"
      ></iframe>
    </section>
  );
}
