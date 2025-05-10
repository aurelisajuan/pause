import React, { useState } from "react";
import "./styles.css";

const PausePopup: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);

  const handlePause = () => {
    setIsPaused(true);
    // Add animation or transition here
    setTimeout(() => {
      setIsPaused(false);
    }, 5000); // 5 second pause
  };

  return (
    <div className={`popup-container ${isPaused ? "paused" : ""}`}>
      <header className="popup-header">
        <h1 className="logo">Pause</h1>
      </header>

      <main className="popup-content">
        {!isPaused ? (
          <>
            <p className="message">Take a moment to breathe</p>
            <button className="pause-button" onClick={handlePause}>
              Pause
            </button>
          </>
        ) : (
          <div className="pause-animation">
            <div className="breathing-circle"></div>
            <p className="breathing-text">Breathe in... Breathe out...</p>
          </div>
        )}
      </main>

      <footer className="popup-footer">
        <p className="tagline">Designing the moments between moments</p>
      </footer>
    </div>
  );
};

export default PausePopup;
