import { useState } from "react";
import "./App.css"; // we'll define styles below

const API_URL = "http://localhost:8000";

function App() {
  const [mainImage, setMainImage] = useState(null);
  const [optionalImage, setOptionalImage] = useState(null);
  const [prompt, setPrompt] = useState("make brighter picture");
  const [previewMain, setPreviewMain] = useState(null);
  const [previewOptional, setPreviewOptional] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMainChange = (e) => {
    const file = e.target.files[0];
    setMainImage(file || null);
    setPreviewMain(file ? URL.createObjectURL(file) : null);
  };

  const handleOptionalChange = (e) => {
    const file = e.target.files[0];
    setOptionalImage(file || null);
    setPreviewOptional(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResultUrl(null);

    if (!mainImage) {
      setError("Please upload the main image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image_main", mainImage);
    if (optionalImage) {
      formData.append("image_optional", optionalImage);
    }
    formData.append("prompt", prompt);

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/personalize`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Something went wrong");
      }

      const data = await res.json();
      const rawUrl = data.result_url;

      const fullUrl = rawUrl.startsWith("http")
        ? rawUrl
        : `${API_URL}${rawUrl}`;

      setResultUrl(fullUrl);
    } catch (err) {
      setError(err.message || "Failed to generate image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-root">
      <div className="glass-card">
        <header className="header">
          <h1>InstantID Personalizer</h1>
          <p>
            Upload your main photo, optionally add a second image for
            personalization, and let the magic happen ✨
          </p>
        </header>

        <form className="form" onSubmit={handleSubmit}>
          {/* Main image (required) */}
          <div className="field">
            <label className="label">
              Main Image <span className="chip chip-required">required</span>
            </label>
            <div className="upload-row">
              <label className="upload-box">
                <span>Click to upload</span>
                <span className="upload-subtext">JPG / PNG</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainChange}
                  hidden
                />
              </label>
              {previewMain && (
                <img
                  src={previewMain}
                  alt="Main preview"
                  className="preview-img"
                />
              )}
            </div>
          </div>

          {/* Optional image */}
          <div className="field">
            <label className="label">
              Personalization Image{" "}
              <span className="chip chip-optional">optional</span>
            </label>
            <p className="hint">
              If you add this, we’ll use it as a pose / style reference.
              Otherwise we’ll just reuse the main image.
            </p>
            <div className="upload-row">
              <label className="upload-box upload-box-ghost">
                <span>Click to upload</span>
                <span className="upload-subtext">JPG / PNG</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleOptionalChange}
                  hidden
                />
              </label>
              {previewOptional && (
                <img
                  src={previewOptional}
                  alt="Optional preview"
                  className="preview-img"
                />
              )}
            </div>
          </div>

          {/* Prompt */}
          <div className="field">
            <label className="label">Prompt</label>
            <textarea
              className="prompt-input"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe how you want the image to look..."
            />
          </div>

          {/* Error message */}
          {error && <div className="error-banner">{error}</div>}

          {/* Action button */}
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Personalized Image"}
          </button>
        </form>

        {/* Result */}
        {resultUrl && (
          <section className="result-section">
            <h2>Your Result</h2>
            <img src={resultUrl} alt="Result" className="result-img" />
            <a href={resultUrl} target="_blank" rel="noreferrer" className="link">
              Open full image ↗
            </a>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
