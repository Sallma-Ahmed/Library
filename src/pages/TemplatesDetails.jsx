import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import data from "../json/data.json";
import Navbar from "../components/navbar";

export default function TemplateDetailsPage() {
  const { id } = useParams();
  const template = data.find((t) => t.id === Number(id));
  const [copied, setCopied] = useState(null); 

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500); 
  };

  if (!template) {
    return (
      <div className="template-details">
        <div className="template-card">
          <h2>Template not found</h2>
      
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
          <h1>{template.name}</h1>
        </div>

        <div className="template-details">
          <div className="template-card">
            <div className="template-info">
              <p className="text">
                Team: <span>{template.team}</span>
              </p>
              <p className="text">
                Subject: <span>{template.subject}</span>
              </p>
              <p className="text">
                Category: <span>{template.category}</span>
              </p>
            </div>

            {/* === Server Link === */}
            {template.serverUrl && (
              <div className="link-row">
                <a
                  href={template.serverUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="server-link"
                >
               Open on Server
                </a>
                <button
                  className="copy-btn"
                  onClick={() => handleCopy(template.serverUrl, "server")}
                >
                  {copied === "server" ? (
                    <span className="copied-text">
                     Copied!
                    </span>
                  ) : (
                    <i className="fa-regular fa-copy"></i>
                  )}
                </button>
              </div>
            )}

            {/* === Demo Link === */}
            {template.demoUrl && (
              <div className="link-row">
                <a
                  href={template.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="server-link"
                >
                  <i className="fa-solid fa-globe"></i> Open Demo Online
                </a>
                <button
                  className="copy-btn"
                  onClick={() => handleCopy(template.demoUrl, "demo")}
                >
                  {copied === "demo" ? (
                    <span className="copied-text">
                      <i className="fa-solid fa-check"></i> Copied!
                    </span>
                  ) : (
                    <i className="fa-regular fa-copy"></i>
                  )}
                </button>
              </div>
            )}

            {/* === Demo Frame === */}
            {template.demoUrl ? (
              <div className="demo-frame">
                <iframe
                  src={template.demoUrl}
                  title={`${template.name} demo`}
                ></iframe>
              </div>
            ) : (
              <span className="no-demo">No demo available</span>
            )}
          </div>
        </div>

      </section>
    </div>
  );
}
