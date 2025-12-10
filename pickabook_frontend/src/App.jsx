import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [templateId, setTemplateId] = useState("template_1");
  const [prompt, setPrompt] = useState("make brighter picture");
  const [resultUrl, setResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  const handleFileChange = (e) => {
    const img = e.target.files[0];
    if (!img) return;

    setFile(img);
    setPreview(URL.createObjectURL(img));
    setResultUrl(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload a child's photo.");
      return;
    }

    setLoading(true);
    setResultUrl(null);
    setError("");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("template_id", templateId);
    formData.append("prompt", prompt);

    try {
      const res = await fetch(`${API_URL}/personalize`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error("Server error: " + errText);
      }

      const data = await res.json();

      // backend returns: /generated/<file>.png
      const finalUrl = data.result_url.startsWith("http")
        ? data.result_url
        : `${API_URL}${data.result_url}`;

      setResultUrl(finalUrl);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>InstantID Child Illustration Personalizer</h1>

      <form onSubmit={handleSubmit}>
        <label>Upload Child Photo:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <label>Select Template:</label>
        <select value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
          <option value="template_1">Template 1</option>
          {/* Add more templates if needed */}
        </select>

        <label>Prompt (optional):</label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the illustration style"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Illustration"}
        </button>

        {error && <p className="error">{error}</p>}
      </form>

      <div className="preview-section">
        <div>
          <h2>Original</h2>
          {preview ? (
            <img src={preview} alt="preview" className="preview-img" />
          ) : (
            <p>No image uploaded.</p>
          )}
        </div>

        <div>
          <h2>Illustration</h2>
          {loading ? (
            <p>Running InstantID...</p>
          ) : resultUrl ? (
            <>
              <img src={resultUrl} alt="result" className="preview-img" />
              <br />
              <a href={resultUrl} download="result.png">
                Download Result
              </a>
            </>
          ) : (
            <p>No output yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
