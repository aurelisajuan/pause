import React, { useEffect, useState } from 'react';
// import ChatBot from './ChatBot';
import '../styles.css';

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
  const [bounds, setBounds] = useState<Bounds>({
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // 1) Flip to chat after your “pulse” duration
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
          // pick the primary display (or the first one)
          const primary = displays.find(d => d.isPrimary) || displays[0];
          setBounds(primary.bounds);
        })
        .catch(console.error);
    }
  }, []);

  const borderStyle: React.CSSProperties = {
    position: 'absolute',
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height,
    border: '4px solid rgba(34,211,238,0.7)',
    borderRadius: 36,
    boxShadow: '0 0 40px 0 #22d3eecc',
    pointerEvents: 'none',
    zIndex: 10,
  };

  return (
    <div
      style={{
        position: 'relative',
        width: bounds.width,
        height: bounds.height,
        overflow: 'hidden',
        background: '#101914',
      }}
    >
      {/* full-screen glow border */}
      <div style={borderStyle} />

      {/* your "body" sits on top of the border */}
      <main
        style={{
          position: 'relative',
          zIndex: 20,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: 24,
        }}
      >
        {!showChat ? (
          <div
            style={{
              background: '#101914',
              border: '2px solid rgba(34,211,238,0.4)',
              borderRadius: 32,
              padding: '1rem 1.5rem',
              textAlign: 'center',
            }}
          >
            <h2 style={{ color: '#22d3ee', marginBottom: 8 }}>Scanning the page…</h2>
            <p style={{ color: '#94a3b8' }}>Take a breath while we analyze.</p>
          </div>
        ) : (
          // <ChatBot />
          <div>
            <h2>ChatBot</h2>
          </div>
        )}
      </main>
    </div>
  );
};

export default GlowPage;
