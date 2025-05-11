import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
} from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../config";
import "../styles.css";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface ConversationContext {
    currentTopic: string;
    userMood: string;
    lastActivity: string;
    suggestedNextSteps: string[];
    isSpeaking: boolean;
    isListening: boolean;
}

const SYSTEM_INSTRUCTION = `
    You are a warm, empathetic mindfulness assistant focused on having natural conversations with users about their digital wellbeing.
    Your goal is to create a comfortable, supportive space where users can discuss their feelings about screen time and digital habits.

    Conversation Guidelines:
    1. Always maintain a warm, friendly tone
    2. Ask follow-up questions to show you're listening and understanding
    3. Share personal-sounding observations (e.g., "I notice you seem...")
    4. Validate user feelings before offering suggestions
    5. Use natural transitions between topics
    6. Remember and reference previous parts of the conversation

    Key Conversation Flows:
    1. Emotional Check-ins:
        - Ask how they're feeling about their screen time
        - Validate their emotions
        - Explore underlying causes gently

    2. Mindful Moments:
        - Guide through brief mindfulness exercises
        - Check in on their experience
        - Adjust based on their feedback

    3. Progress Discussions:
        - Remember their goals
        - Celebrate small wins
        - Problem-solve challenges together

    4. Practical Tips:
        - Offer suggestions naturally in conversation
        - Share relevant mindfulness techniques
        - Provide gentle accountability

    Always maintain a natural conversation flow, asking questions and showing genuine interest in their responses.
    End responses with open questions or gentle prompts to continue the conversation.
`;

const ChatBot: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [chatSession, setChatSession] = useState<any>(null);
    const [context, setContext] = useState<ConversationContext>({
        currentTopic: "greeting",
        userMood: "unknown",
        lastActivity: "none",
        suggestedNextSteps: [],
        isSpeaking: false,
        isListening: false,
    });

    const endRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);
    const synth = window.speechSynthesis;

    // 1) Auto-scroll on new messages/loading
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    // 2) Initialize Gemini and seed initial greeting
    useEffect(() => {
        (async () => {
        if (!GEMINI_API_KEY) {
            setError("Missing GEMINI_API_KEY in config.");
            return;
        }
        try {
            const ai = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
            const session = await model.startChat({
            history: [
                { role: "user", parts: [{ text: SYSTEM_INSTRUCTION }] },
            ],
            generationConfig: {
                maxOutputTokens: 800,
                temperature: 0.8,
                topK: 40,
                topP: 0.95,
            },
            });
            setChatSession(session);

            // seed initial assistant message & speak it
            const greeting =
            "Hi there! I’m your mindfulness companion. How are you feeling about your screen time today?";
            setMessages([{ role: "assistant", content: greeting }]);
            setTimeout(() => speakText(greeting), 500);
        } catch (e: any) {
            console.error(e);
            setError("Failed to initialize AI session.");
        }
        })();
    }, []); // empty deps

    // 3) Text-to-speech with jitter for naturalness
    const speakText = useCallback(
        (raw: string) => {
        if (!raw || synth.speaking || context.isListening) return;
        const text = raw.replace(/\s+/g, " ").trim();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.pitch = 1 + (Math.random() * 0.2 - 0.1);
        utterance.rate = 1 + (Math.random() * 0.2 - 0.1);
        utterance.volume = 1;
        const voice = synth
            .getVoices()
            .find((v) =>
            /Samantha|Google US English Female|Female/.test(v.name)
            );
        if (voice) utterance.voice = voice;
        utterance.onstart = () =>
            setContext((c) => ({ ...c, isSpeaking: true }));
        utterance.onend = () =>
            setContext((c) => ({ ...c, isSpeaking: false }));
        utterance.onerror = () =>
            setContext((c) => ({ ...c, isSpeaking: false }));
        synth.cancel();
        synth.speak(utterance);
        },
        [synth, context.isListening]
    );

    // 4) Update context heuristically
    const updateContext = useCallback(
        (userMsg: string, aiMsg: string) => {
        setContext((c) => {
            let topic = c.currentTopic,
            mood = c.userMood,
            last = c.lastActivity;

            if (/feel|mood/i.test(userMsg)) topic = "emotional";
            else if (/breath|exercise/i.test(userMsg))
            topic = "mindful_exercise";

            if (/stress|anxious/i.test(userMsg)) mood = "stressed";
            else if (/happy|good/i.test(userMsg)) mood = "positive";

            if (/breathe|exercise/i.test(aiMsg)) last = "breathing";

            return { ...c, currentTopic: topic, userMood: mood, lastActivity: last };
        });
        },
        []
    );

    // 5) sendMessage callback
    const sendMessage = useCallback(
        async (forced?: string) => {
        const text = (forced ?? input).trim();
        if (!text || isLoading || !chatSession) return;
        if (synth.speaking) {
            synth.cancel();
            setContext((c) => ({ ...c, isSpeaking: false }));
        }

        setMessages((ms) => [...ms, { role: "user", content: text }]);
        setInput("");
        setIsLoading(true);
        setError(null);

        try {
            const prompt = `
                Topic: ${context.currentTopic}
                Mood: ${context.userMood}

                User: ${text}

                Please respond warmly and ask a follow-up question.
            `.trim();

            const res = await chatSession.sendMessage(prompt);
            const aiReply = await res.response.text();

            setMessages((ms) => [
            ...ms,
            { role: "assistant", content: aiReply },
            ]);
            updateContext(text, aiReply);
            speakText(aiReply);
        } catch (e: any) {
            console.error(e);
            const msg = "Oops, something went wrong. Could we try again?";
            setMessages((ms) => [
            ...ms,
            { role: "assistant", content: msg },
            ]);
            speakText(msg);
        } finally {
            setIsLoading(false);
        }
        },
        [
            chatSession,
            context,
            input,
            isLoading,
            synth,
            speakText,
            updateContext,
        ]
    );

    // 6) SpeechRecognition setup
    useEffect(() => {
        const SR =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
        if (!SR) return console.warn("SpeechRecognition not supported");

        const recog = new SR();
        recognitionRef.current = recog;
        recog.continuous = false;
        recog.interimResults = false;
        recog.lang = "en-US";

        recog.onstart = () =>
        setContext((c) => ({ ...c, isListening: true }));
        recog.onend = () =>
        setContext((c) => ({ ...c, isListening: false }));
        recog.onerror = (ev: any) => {
        console.error("SpeechRecognition error", ev);
        setError(
            ev.error === "not-allowed"
            ? "Please allow microphone access."
            : "Voice recognition error."
        );
        setContext((c) => ({ ...c, isListening: false }));
        };
        recog.onresult = (ev: any) => {
        const transcript = ev.results[0][0].transcript;
        setInput(transcript);
        setTimeout(() => sendMessage(transcript), 500);
        };

        return () => recog.abort();
    }, [sendMessage]);

    // 7) startListening using chrome.audio
    const startListening = () => {
        setError(null);

        try {
            recognitionRef.current?.start();
        } catch (e) {
            console.error(e);
            setError("Voice recognition not supported or failed to start.");
        }
    };

    // 8) Stop TTS if user types
    const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        if (synth.speaking) {
        synth.cancel();
        setContext((c) => ({ ...c, isSpeaking: false }));
        }
    };

    return (
        <div className="flex flex-col w-[400px] h-[600px] bg-gray-900 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
            <h2 className="text-white font-semibold">
            Mindfulness Assistant
            </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m, i) => (
            <div
                key={i}
                className={`max-w-[75%] px-4 py-2 rounded-lg whitespace-pre-wrap ${
                m.role === "user"
                    ? "self-end bg-teal-400 text-black"
                    : "self-start bg-gray-700 text-white"
                }`}
            >
                {m.content}
            </div>
            ))}
            {isLoading && (
            <div className="self-start animate-pulse bg-gray-700 text-white px-4 py-2 rounded-lg">
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

        {/* Input & Controls */}
        <div className="flex items-center p-4 bg-gray-800 border-t border-gray-700 space-x-2">
            <textarea
            rows={1}
            className="flex-1 bg-gray-700 text-white placeholder-gray-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
            placeholder={
                context.isListening
                ? "Listening…"
                : "Type or 🎙️ to speak"
            }
            value={input}
            onChange={onInputChange}
            onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
                }
            }}
            disabled={isLoading || context.isListening}
            />
            <button
            onClick={startListening}
            className={`p-2 rounded-full transition ${
                context.isListening
                ? "bg-red-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            disabled={isLoading}
            title={
                context.isListening
                ? "Listening…"
                : "Start voice input"
            }
            >
            🎙️
            </button>
            <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading || context.isListening}
            className="bg-teal-400 text-black px-4 py-2 rounded-lg disabled:opacity-50"
            >
            {isLoading ? "…" : "Send"}
            </button>
        </div>
        </div>
    );
};

export default ChatBot;