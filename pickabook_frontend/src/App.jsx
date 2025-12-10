import { useState } from "react";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

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

  const handleDownload = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = "instantid_result.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page">
      {/* top nav / brand bar */}
      <nav className="nav">
        <div className="nav-left">
          <div className="logo-dot" />
          <span className="logo-text">InstantID Studio</span>
        </div>
        <div className="nav-right">
          <span className="nav-pill">beta</span>
        </div>
      </nav>

      {/* main content */}
      <main className="main-layout">
        {/* left column – text + form */}
        <section className="left-panel">
          <header className="hero">
            <h1>Create AI-personalized portraits in seconds</h1>
            <p>
              Upload your main photo, optionally add a personalization image for
              pose / style, describe what you want – we’ll generate a unique
              result for you.
            </p>
          </header>

          <form className="form" onSubmit={handleSubmit}>
            {/* Main image (required) */}
            <div className="field">
              <label className="label">
                Main image
                <span className="chip chip-required">required</span>
              </label>
              <div className="upload-row">
                <label className="upload-box">
                  <span className="upload-title">Click to upload</span>
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
                Personalization image
                <span className="chip chip-optional">optional</span>
              </label>
              <p className="hint">
                Use this as a pose / style reference. If you skip it, we’ll
                just reuse the main image.
              </p>
              <div className="upload-row">
                <label className="upload-box upload-box-ghost">
                  <span className="upload-title">Click to upload</span>
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
                placeholder="e.g. high-quality studio portrait, soft lighting, cinematic look"
              />
            </div>

            {error && <div className="error-banner">{error}</div>}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate image"}
            </button>
          </form>
        </section>

        {/* right column – result preview */}
        <section className="right-panel">
          <div className="result-card">
            <h2>Your preview</h2>
            <p className="result-caption">
              Generated image will appear here. You can open it in a new tab or
              download it.
            </p>

            <div className="result-frame">
              {resultUrl ? (
                <img
                  src={resultUrl}
                  alt="Result"
                  className="result-img"
                />
              ) : (
                <div className="result-placeholder">
                  <span>Waiting for your first generation ✨</span>
                </div>
              )}
            </div>

            <div className="result-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleDownload}
                disabled={!resultUrl}
              >
                Download image
              </button>
              {resultUrl && (
                <a
                  href={resultUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="link-open"
                >
                  Open full size ↗
                </a>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
