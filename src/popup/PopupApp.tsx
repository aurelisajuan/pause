import React from "react";
import "../styles.css";
import GlowPage from "../content/GlowPage";
import logo from "../../images/logo-dark.png";
import landing from "../../images/landingBg.png";

const PopupApp: React.FC = () => {
  const [showGlow, setShowGlow] = React.useState(false);
  const [glowDuration, setGlowDuration] = React.useState(3000);

  const handleGetStarted = async () => {
    // Call backend to get glow duration
    try {
      const res = await fetch("http://localhost:3001/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setGlowDuration(data.glowDuration || 3000);
    } catch (e) {
      setGlowDuration(3000);
    }
      // Send a message to the content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "startPause" });
        }
      });

    setShowGlow(true);
  };

  if (showGlow) {
    return <GlowPage glowDuration={glowDuration} />;
  }

  return (
    <div 
      className="w-[400px] flex flex-col justify-between items-center bg-[#101914] relative overflow-hidden"
      style={{
        backgroundImage: `url(${landing})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >

      <main className="relative z-10 w-full flex flex-col items-center justify-center flex-1">
        <div className="mt-12 mb-8 max-w-md flex flex-col items-center pt-8 pb-16">
          {/* Logo/Title */}
          <div className="flex items-center justify-center">
            <img src={logo} alt="Pause Logo" width={320} height="auto" className="mb-2"/>
          </div>

          <div className="w-full flex flex-col items-start mb-2">
            <span className="text-slate-400 text-lg italic mb-1">/pōz/</span>
            <span className="text-white text-base mb-1">noun</span>
            <span className="text-white text-2xl font-semibold mb-2">
              Nothing to fix. Just breathe.
            </span>
            <span className="text-slate-400 text-base leading-tight">
              "Pause is not a productivity tool.
              <br />
              It's a presence tool."
            </span>
          </div>

          <button
            className="mt-8 w-[65%] py-3 rounded-full border-4 bg-[#4BAABE] bg-opacity-50 border-cyan-400 text-white text-xl font-bold shadow-lg hover:bg-cyan-400 hover:text-[#101914] transition-colors"
            onClick={handleGetStarted} id="takePause"
          >
            Get Started
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-slate-400 text-xs mb-4 z-10">
        &copy; 2025 BaNaNa
      </footer>

      {/* Decorative curve */}
      <div
        className="absolute left-0 bottom-0 w-full h-1/3 bg-gradient-to-t from-[#101914] to-transparent rounded-t-[100px] -z-1"
        style={{ filter: "blur(2px)" }}
      />
    </div>
  );
};

export default PopupApp;
