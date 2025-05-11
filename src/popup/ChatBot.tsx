import React, { useState } from 'react';
import '../styles.css';

/**
 * Basic placeholder chatbot UI that echoes user input after a delay.
 */
const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages(prev => [...prev, `User: ${trimmed}`, `Bot: (thinking...)`]);
    setInput('');
    // Simulate API response
    setTimeout(() => {
      setMessages(prev => {
        const lastUser = prev[prev.length - 2]?.split(': ')[1] || '';
        return [...prev.slice(0, -1), `Bot: You said "${lastUser}"`];
      });
    }, 1000);
  };

  return (
    <div className="chatbot-container">
      <div style={{ flex: 1, padding: 12, overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: '4px 0', color: '#e5e7eb' }}>{m}</div>
        ))}
      </div>
      <div style={{ padding: 8, borderTop: '1px solid #374151', display: 'flex' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          style={{
            flex: 1,
            padding: '8px',
            background: '#111827',
            color: '#f9fafb',
            border: 'none',
            borderRadius: 4,
          }}
        />
        <button
          onClick={send}
          style={{ marginLeft: 8, padding: '8px 12px', background: '#22d3ee', border: 'none', borderRadius: 4 }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;