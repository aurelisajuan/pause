import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../config";

// Add the overlay styles
const OVERLAY_STYLES = `
@keyframes pause-text-fade {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
}

.pause-header {
    position: absolute;
    top: 0;
    right: 0;
    padding: 1.5rem;
    z-index: 10;
}

.pause-close-button {
    background: transparent;
    border: none;
    color: rgba(255,255,255,0.7);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    padding: 0;
}

.pause-close-button:hover {
    background: rgba(255,255,255,0.1);
    color: white;
    transform: scale(1.1);
}

.pause-close-button svg {
    width: 24px;
    height: 24px;
}

.pause-chatbot-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
    animation: pause-text-fade 0.5s ease-out;
}

.pause-logo {
    width: 200px;
    margin-bottom: 2rem;
}

.pause-title {
    color: white;
    font-size: 3.5rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
    text-align: center;
    line-height: 1.2;
}

.pause-subtitle {
    color: white;
    font-size: 2.5rem;
    margin-bottom: 2.5rem;
    text-align: center;
}

.pause-buttons {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 2.5rem;
}

.pause-button {
    background: transparent;
    border: 2px solid #22d3ee;
    color: white;
    padding: 1rem 2rem;
    border-radius: 9999px;
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 200px;
    text-align: center;
}

.pause-button:hover {
    background: rgba(34,211,238,0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34,211,238,0.3);
}

.pause-search {
    width: 100%;
    max-width: 700px;
    background: rgba(34,211,238,0.1);
    border: 2px solid rgba(34,211,238,0.3);
    border-radius: 9999px;
    padding: 1.25rem 2rem;
    color: white;
    font-size: 1.25rem;
    margin-bottom: 2.5rem;
    transition: all 0.2s;
}

.pause-search:focus {
    outline: none;
    border-color: #22d3ee;
    background: rgba(34,211,238,0.15);
    box-shadow: 0 0 0 3px rgba(34,211,238,0.3);
}

.pause-search::placeholder {
    color: rgba(255,255,255,0.6);
}

.transcript-toggle {
    background: transparent;
    border: none;
    color: rgba(255,255,255,0.7);
    font-size: 1rem;
    cursor: pointer;
    padding: 0.5rem 1rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
}

.transcript-toggle:hover {
    color: white;
}

.transcript-toggle svg {
    width: 20px;
    height: 20px;
    transition: transform 0.2s;
}

.transcript-toggle.open svg {
    transform: rotate(180deg);
}

.chat-messages {
    width: 100%;
    max-width: 700px;
    max-height: 0;
    overflow: hidden;
    padding: 0;
    transition: all 0.3s ease-out;
}

.chat-messages.open {
    max-height: 400px;
    overflow-y: auto;
    padding: 1rem;
}

.chat-message {
    margin-bottom: 1rem;
    padding: 1rem 1.5rem;
    border-radius: 1rem;
    color: white;
    font-size: 1.1rem;
    line-height: 1.5;
}

.chat-message.user {
    background: rgba(34,211,238,0.2);
    margin-left: 2rem;
    border-bottom-right-radius: 0.25rem;
}

.chat-message.assistant {
    background: rgba(0,0,0,0.3);
    margin-right: 2rem;
    border-bottom-left-radius: 0.25rem;
}
`;

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

class ChatOverlay {
    constructor() {
        this.messages = [];
        this.context = {
            currentTopic: "greeting",
            userMood: "unknown",
            lastActivity: "none",
            isSpeaking: false,
            isListening: false
        };
        this.synth = window.speechSynthesis;
        this.chatSession = null;
        this.overlayElement = null;
        this.isInitialized = false;
        
        // Inject styles
        if (!document.getElementById('pause-chat-styles')) {
            const style = document.createElement('style');
            style.id = 'pause-chat-styles';
            style.textContent = OVERLAY_STYLES;
            document.head.appendChild(style);
        }
    }

    async initialize() {
        if (this.isInitialized) return;
        
        try {
            const ai = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
            this.chatSession = await model.startChat({
                history: [{ role: "user", parts: [{ text: SYSTEM_INSTRUCTION }] }],
                generationConfig: {
                    maxOutputTokens: 800,
                    temperature: 0.8,
                    topK: 40,
                    topP: 0.95,
                }
            });

            const greeting = "Hi there! I'm your mindfulness companion. How are you feeling about your screen time today?";
            this.messages.push({ role: "assistant", content: greeting });
            setTimeout(() => this.speakText(greeting), 500);
            
            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize AI:', error);
            throw error;
        }
    }

    createOverlay() {
        // Create the main overlay container
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(16, 25, 20, 0.95);
            z-index: 999999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: system-ui, -apple-system, sans-serif;
        `;

        // Add the content
        overlay.innerHTML = `
            <div class="pause-header">
                <button class="pause-close-button">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="pause-chatbot-container">
                <h1 class="pause-title">Let's <em>pause</em> and step back,</h1>
                <h2 class="pause-subtitle">What can I assist you with?</h2>
                <div class="pause-buttons">
                    <button class="pause-button" data-action="quotes">Get Some Quotes</button>
                    <button class="pause-button" data-action="audio">Listen to Audio</button>
                    <button class="pause-button" data-action="nature">Picture Nature</button>
                </div>
                <input type="text" class="pause-search" placeholder="Type here ...">
                <button class="transcript-toggle">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                    Show Transcript
                </button>
                <div class="chat-messages"></div>
            </div>
        `;

        // Add event listeners
        const searchInput = overlay.querySelector('.pause-search');
        searchInput.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
                await this.sendMessage(e.target.value.trim());
                e.target.value = '';
            }
        });

        const buttons = overlay.querySelectorAll('.pause-button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                this.handleButtonClick(action);
            });
        });

        // Add close button functionality
        const closeButton = overlay.querySelector('.pause-close-button');
        closeButton.addEventListener('click', () => {
            this.hide();
        });

        // Add transcript toggle functionality
        const transcriptToggle = overlay.querySelector('.transcript-toggle');
        const chatMessages = overlay.querySelector('.chat-messages');
        transcriptToggle.addEventListener('click', () => {
            chatMessages.classList.toggle('open');
            transcriptToggle.classList.toggle('open');
            transcriptToggle.innerHTML = chatMessages.classList.contains('open') 
                ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                   </svg>
                   Hide Transcript`
                : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                   </svg>
                   Show Transcript`;
        });

        this.overlayElement = overlay;
        document.body.appendChild(overlay);
    }

    async sendMessage(text) {
        if (!text || !this.chatSession) return;
        
        if (this.synth.speaking) {
            this.synth.cancel();
            this.context.isSpeaking = false;
        }

        this.messages.push({ role: "user", content: text });
        this.updateChatDisplay();

        try {
            const prompt = `
                Topic: ${this.context.currentTopic}
                Mood: ${this.context.userMood}
                User: ${text}
                Please respond warmly and ask a follow-up question.
            `.trim();

            const res = await this.chatSession.sendMessage(prompt);
            const aiReply = await res.response.text();

            this.messages.push({ role: "assistant", content: aiReply });
            this.updateContext(text, aiReply);
            this.speakText(aiReply);
            this.updateChatDisplay();
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    }

    updateChatDisplay() {
        const chatMessages = this.overlayElement.querySelector('.chat-messages');
        chatMessages.innerHTML = this.messages.map(msg => `
            <div class="chat-message ${msg.role}">
                <div class="message-content">${msg.content}</div>
            </div>
        `).join('');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    speakText(text) {
        if (!text || this.synth.speaking || this.context.isListening) return;
        
        const utterance = new SpeechSynthesisUtterance(text.replace(/\s+/g, " ").trim());
        utterance.lang = "en-US";
        utterance.pitch = 1 + (Math.random() * 0.2 - 0.1);
        utterance.rate = 1 + (Math.random() * 0.2 - 0.1);
        utterance.volume = 1;
        
        const voice = this.synth.getVoices().find(v => /Samantha|Google US English Female|Female/.test(v.name));
        if (voice) utterance.voice = voice;
        
        utterance.onstart = () => this.context.isSpeaking = true;
        utterance.onend = () => this.context.isSpeaking = false;
        utterance.onerror = () => this.context.isSpeaking = false;
        
        this.synth.cancel();
        this.synth.speak(utterance);
    }

    updateContext(userMsg, aiMsg) {
        if (/feel|mood/i.test(userMsg)) this.context.currentTopic = "emotional";
        else if (/breath|exercise/i.test(userMsg)) this.context.currentTopic = "mindful_exercise";

        if (/stress|anxious/i.test(userMsg)) this.context.userMood = "stressed";
        else if (/happy|good/i.test(userMsg)) this.context.userMood = "positive";

        if (/breathe|exercise/i.test(aiMsg)) this.context.lastActivity = "breathing";
    }

    handleButtonClick(action) {
        const actionMessages = {
            quotes: "Could you share some mindfulness quotes with me?",
            audio: "I'd like to listen to some calming sounds.",
            nature: "Can you describe a peaceful nature scene?"
        };

        if (actionMessages[action]) {
            this.sendMessage(actionMessages[action]);
        }
    }

    show() {
        console.log('[Pause] Show method called');
        if (!this.overlayElement) {
            console.log('[Pause] Creating overlay element');
            this.createOverlay();
        }
        
        // Ensure the element exists in the DOM
        if (!document.body.contains(this.overlayElement)) {
            console.log('[Pause] Appending overlay to body');
            document.body.appendChild(this.overlayElement);
        }
        
        // Use requestAnimationFrame for smooth transition
        requestAnimationFrame(() => {
            this.overlayElement.style.display = 'flex';
            this.overlayElement.style.opacity = '0';
            
            requestAnimationFrame(() => {
                this.overlayElement.style.opacity = '1';
                console.log('[Pause] Overlay visible');
            });
        });
    }

    hide() {
        console.log('[Pause] Hide method called');
        if (this.overlayElement) {
            this.overlayElement.style.opacity = '0';
            setTimeout(() => {
                this.overlayElement.style.display = 'none';
                console.log('[Pause] Overlay hidden');
            }, 300);
        }
    }
}

export default ChatOverlay; 