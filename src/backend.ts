import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Configurable glow duration (ms)
let glowDuration = 3000;

// Endpoint to trigger scan (glow effect)
app.post('/scan', (req, res) => {
  const { duration } = req.body;
  if (duration) glowDuration = duration;
  // Respond with the duration for the frontend to use
  res.json({ glowDuration });
});

// Endpoint for Gemini conversational chat (stub)
app.post('/chat', async (req, res) => {
  const { message, conversationId } = req.body;
  // TODO: Integrate Gemini API here
  // For now, just echo the message
  res.json({ reply: `Echo: ${message}`, conversationId });
});

export function startBackend(port = 3001) {
  app.listen(port, () => {
    console.log(`Backend started on port ${port}`);
  });
} 