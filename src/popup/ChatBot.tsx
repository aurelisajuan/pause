import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config';

interface Message { role: 'user' | 'assistant'; content: string }

const SYSTEM_INSTRUCTION = `
    You are a mindfulness assistant therapist focused on helping users take mindful pauses during their digital life.
    Your goal is to help users understand the importance of taking breaks, managing screen time, and maintaining digital wellbeing.
    Explain concepts clearly, simply, and encouragingly. Do not mention you are an AI model.
    Services:
    1. Guide breathing exercises (with countdown & optional audio).
    2. Share motivational quotes on digital wellbeing.
    3. Show calming nature imagery.
    After each, ask if they want to continue. Conclude with an encouraging “Pause.”
`;

const ChatBot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([{
        role: 'assistant',
        content: `Hi! I'm your mindfulness assistant. I can help you with:\n1. Breathing exercises\n2. Motivational quotes\n3. Calming nature imagery\n\nHow can I assist you today?`,
    }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [chatSession, setChatSession] = useState<any>(null);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages, isLoading]);

    useEffect(() => {
        if (!GEMINI_API_KEY) {
        setError('Missing GEMINI_API_KEY in config.ts');
        return;
        }
        try {
        const ai = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const session = model.startChat({
            history: [
            { role: 'user', parts: [{ text: SYSTEM_INSTRUCTION }] },
            { role: 'model', parts: [{ text: "Instruction understood. Ready to guide users." }] }
            ],
            generationConfig: { maxOutputTokens: 1000, temperature: 0.7, topK: 1, topP: 1 }
        });
        setChatSession(session);
        } catch (e) {
        console.error(e);
        setError('Failed to initialize AI client.');
        }
    }, []);

    const sendMessage = async () => {
        const text = input.trim(); if (!text || isLoading || !chatSession) return;
        setMessages(m => [...m, { role: 'user', content: text }]);
        setInput(''); setIsLoading(true); setError(null);
        try {
        const result = await chatSession.sendMessage(text);
        const res = await result.response;
        const reply = res.text();
        setMessages(m => [...m, { role: 'assistant', content: reply }]);
        } catch (e: any) {
        console.error(e);
        const msg = e.message || 'Unknown error';
        setError(msg);
        setMessages(m => [...m, { role: 'assistant', content: `Error: ${msg}` }]);
        } finally { setIsLoading(false) }
    };

    return (
        <div className="flex flex-col w-[400px] h-[600px] bg-gray-900 rounded-xl overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m,i) => (
            <div
                key={i}
                className={`max-w-3/4 px-4 py-2 rounded-lg whitespace-pre-wrap ${
                m.role === 'user'
                    ? 'self-end bg-teal-400 text-black'
                    : 'self-start bg-gray-700 text-white'
                }`}
            >{m.content}</div>
            ))}
            {isLoading && (
            <div className="self-start bg-gray-700 text-white px-4 py-2 rounded-lg animate-pulse">
                Thinking…
            </div>
            )}
            {error && (
            <div className="self-start bg-red-600 text-white px-4 py-2 rounded-lg">
                {error}
            </div>
            )}
            <div ref={endRef} />
        </div>

        <div className="flex items-center p-4 bg-gray-800 border-t border-gray-700">
            <textarea
            rows={1}
            className="flex-1 bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
            placeholder="Type a message…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            disabled={!chatSession || isLoading}
            />
            <button
            className="ml-2 bg-teal-400 text-black font-semibold px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={sendMessage}
            disabled={!input.trim() || isLoading || !chatSession}
            >
            {isLoading ? 'Sending…' : 'Send'}
            </button>
        </div>
        </div>
    );
};

export default ChatBot;
