import React, { useEffect, useState } from "react";
import ChatBot from "../popup/ChatBot";
import "../styles.css";
import "./overlay.css";

interface Bounds {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface GlowPageProps {
  glowDuration?: number; // ms
}

const GlowPage: React.FC<GlowPageProps> = ({ glowDuration = 3000 }) => {
  const [showChat, setShowChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bounds, setBounds] = useState<Bounds>({
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // 1) Flip to chat after your "pulse" duration
  useEffect(() => {
    const t = window.setTimeout(() => setShowChat(true), glowDuration);
    return () => clearTimeout(t);
  }, [glowDuration]);

  // 2) Query chrome.system.display
  useEffect(() => {
    if (chrome.system?.display?.getInfo) {
      chrome.system.display
        .getInfo()
        .then((displays) => {
          const primary = displays.find((d) => d.isPrimary) || displays[0];
          setBounds(primary.bounds);
        })
        .catch(console.error);
    }
  }, []);

  const handleButtonClick = (action: string) => {
    console.log("Button clicked:", action);
    // Handle different actions here
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log("Search:", searchQuery);
      // Handle search here
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        boxSizing: "border-box",
        backgroundColor: "rgba(16, 25, 20, 0.95)",
        pointerEvents: "all",
        zIndex: 999999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {!showChat ? (
        <div className="pause-scanning-container">
          <h2 className="pause-scanning-title">Scanning the page…</h2>
          <p className="pause-scanning-text">Take a breath while we analyze.</p>
        </div>
      ) : (
        <div className="pause-chatbot-container">
          <img
            src={chrome.runtime.getURL("icons/logo-dark.png")}
            alt="Pause"
            className="pause-logo"
          />
          <h1 className="pause-title">
            Let's <em>pause</em> and step back,
          </h1>
          <h2 className="pause-subtitle">What can I assist you with?</h2>
          <div className="pause-buttons">
            <button
              className="pause-button"
              onClick={() => handleButtonClick("quotes")}
            >
              Get Some Quotes
            </button>
            <button
              className="pause-button"
              onClick={() => handleButtonClick("audio")}
            >
              Listen to Audio
            </button>
            <button
              className="pause-button"
              onClick={() => handleButtonClick("nature")}
            >
              Picture Nature
            </button>
          </div>
          <input
            type="text"
            className="pause-search"
            placeholder="Type here ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearch}
          />
          <ChatBot />
        </div>
      )}
    </div>
  );
};

export default GlowPage;
