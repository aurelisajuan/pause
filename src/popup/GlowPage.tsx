import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ChatBot from './ChatBot';
import '../styles.css';

type Bounds = { left: number; top: number; width: number; height: number };
interface GlowPageProps { glowDuration?: number /* ms */ }

const GlowPage: React.FC<GlowPageProps> = ({ glowDuration = 3000 }) => {
  const [showChat, setShowChat] = useState(false);
  const [bounds, setBounds] = useState<Bounds | null>(null);

  // After glowDuration, reveal the chat UI
  useEffect(() => {
    const id = window.setTimeout(() => setShowChat(true), glowDuration);
    return () => window.clearTimeout(id);
  }, [glowDuration]);

  // Measure the scan target (#search or body)
  useEffect(() => {
    const target = document.querySelector('#search') || document.body;
    const rect = target.getBoundingClientRect();
    setBounds({
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
    });
  }, []);

  // Ensure DOM is available
  if (typeof document === 'undefined') return null;

  return ReactDOM.createPortal(
    <div className={`fixed inset-0 w-screen h-screen ${showChat ? 'bg-black/60' : 'bg-black/80'} z-[999999] pointer-events-none`}>
      {/* Pulsing highlight */}
      {!showChat && bounds && (
        <div
          className="absolute border-[3px] border-cyan-400/80 rounded-lg animate-pulse box-border"
          style={{
            left: bounds.left,
            top: bounds.top,
            width: bounds.width,
            height: bounds.height,
          }}
        />
      )}

      {/* Chat panel */}
      {showChat && (
        <div className="fixed inset-0 bg-[#1f292e] pointer-events-auto overflow-hidden">
          <ChatBot />
        </div>
      )}
    </div>,
    document.body
  );
};

export default GlowPage;