import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import data from "../json/data.json";
import Navbar from "../components/navbar";

export default function EnvironmentDemoPage() {
  const { id, envId } = useParams();
  const [copied, setCopied] = useState(null);

  const template = data.find((t) => t.id === Number(id));
  const env = template?.environments?.find((e) => e.envId === Number(envId));

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  };

  if (!template || !env) {
    return (
      <div className="template-details">
        <div className="template-card">
          <h2>Environment not found</h2>
        </div>
      </div>
    );
  }

  const user = {
    name: "Salma Ahmed",
    avatar: "/images/icon.png",
  };

  return (
    <div>
      <Navbar
        user={user}
        onProfileClick={() => alert("Profile clicked")}
        onLogout={() => alert("Logged out")}
      />

      <section className="content">
        <div className="title">
          <nav className="breadcrumb">
            <a href="/">Library</a> <span className="separator">-</span>
            <a href="/">templates</a> <span className="separator">-</span>
               <a href={`/environments/${id}`} >
              Environments
            </a><span className="separator">-</span>
            <a href={`/environments/${id}`} className="active">
              Environments Details
            </a>
          </nav>
          <h1>
            <div className="row">
              <span className="title-text">{env.name}</span>
              <div className="items">
                <p className="badge">{template.category}</p>
                <p className="badge">{template.subject}</p>
              </div>
            </div>
          </h1>
        </div>
<div className="links">
  <div className="elements">
    {/* === Server Link === */}
    {env.serverUrl && (
      <div className="link-row">
        <a
          href={env.serverUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="server-link"
        >
          Open on Server
        </a>
        <button
          className="copy-btn"
          onClick={() => handleCopy(env.serverUrl, "server")}
        >
          {copied === "server" ? (
            <span className="copied-text">
              <i className="fa-solid fa-check"></i>
            </span>
          ) : (
            <i className="fa-regular fa-copy"></i>
          )}
        </button>
      </div>
    )}

    {/* === Demo Link === */}
    {env.demoUrl && (
      <div className="link-section">
        <div className="section-title">Demo URL</div>
        <div className="link-row">
          <a
            href={env.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-text"
          >
            {env.demoUrl}
          </a>
          <button
            onClick={() => handleCopy(env.demoUrl, "demo")}
            className="copy-btn"
          >
            {copied === "demo" ? (
              <span className="copied-text">
                <i className="fa-solid fa-check"></i>
              </span>
            ) : (
              <i className="fa-regular fa-copy"></i>
            )}
          </button>
        </div>
      </div>
    )}

    {/* Server Paths */}
    {env.serverPaths && (
      <div className="link-section">
        <span className="title-text">Server Paths</span>
        {Object.entries(env.serverPaths).map(([key, url]) => (
          <div className="link-row" key={key}>
            <div className="path-title">{key.toUpperCase()} Path</div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-text"
            >
              {url}
            </a>
            <button
              onClick={() => handleCopy(url, key)}
              className="copy-btn"
            >
              {copied === key ? (
                <span className="copied-text">
                  <i className="fa-solid fa-check"></i>
                </span>
              ) : (
                <i className="fa-regular fa-copy"></i>
              )}
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

        <div className="template-details">
     


            {/* === Demo Frame === */}
            {env.demoUrl ? (
              <div className="demo-frame">
                <iframe
                  src={env.demoUrl}
                  title={`${env.name} demo`}
                  style={{
                    width: "100%",
                    height: "500px",
                    borderRadius: "10px",
                  }}
                ></iframe>
              </div>
            ) : (
              <span className="no-demo">No demo available</span>
            )}
          </div>
      </section>
    </div>
  );
}
