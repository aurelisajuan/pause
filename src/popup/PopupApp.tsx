import React from "react";
import "./styles.css";

const PopupApp: React.FC = () => {
  return (
    <div className="w-full h-screen min-h-[600px] flex flex-col justify-between items-center bg-[#101914] relative overflow-hidden">
      {/* Glow border */}
      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md rounded-[36px] border-4 border-cyan-400/70 shadow-2xl"
        style={{ boxShadow: "0 0 40px 0 #22d3ee55" }}
      />

      <main className="relative z-10 w-full flex flex-col items-center justify-center flex-1">
        <div className="mt-16 mb-8 w-[90%] max-w-md bg-[#101914] rounded-[32px] flex flex-col items-center px-6 py-8">
          {/* Logo/Title */}
          <div className="flex items-center justify-center mb-2">
            <span className="text-white text-6xl font-extrabold tracking-widest">
              PA
            </span>
            <span
              className="mx-2 flex items-center justify-center w-16 h-16 rounded-full border-4 border-cyan-400 text-cyan-400 text-4xl font-extrabold"
              style={{ boxShadow: "0 0 0 4px #101914" }}
            >
              &#10073;&#10073;
            </span>
            <span className="text-white text-6xl font-extrabold tracking-widest">
              SE
            </span>
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

          <button className="mt-8 w-full py-3 rounded-full border-4 border-cyan-400 bg-[#101914] text-white text-xl font-bold shadow-lg hover:bg-cyan-400 hover:text-[#101914] transition-colors">
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
