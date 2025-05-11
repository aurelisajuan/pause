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
    padding: 1rem;
    z-index: 10;
}

.pause-close-button {
    background: transparent;
    border: none;
    color: rgba(255,255,255,0.7);
    width: 32px;
    height: 32px;
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
    width: 20px;
    height: 20px;
}

.pause-chatbot-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 1.5rem;
    animation: pause-text-fade 0.5s ease-out;
}

.pause-title {
    color: white;
    font-size: 2.5rem;
    font-weight: 500;
    margin-bottom: 1rem;
    text-align: center;
    line-height: 1.2;
}

.pause-title em {
    font-style: italic;
    color: #22d3ee;
}

.pause-subtitle {
    color: white;
    font-size: 1.8rem;
    margin-bottom: 2rem;
    text-align: center;
}

.pause-buttons {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    justify-content: center;
}

.pause-button {
    background: transparent;
    border: 2px solid #22d3ee;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 9999px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 160px;
    text-align: center;
}

.pause-button:hover {
    background: rgba(34,211,238,0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34,211,238,0.3);
}

.input-container {
    width: 100%;
    max-width: 600px;
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
}

.pause-search {
    flex: 1;
    background: rgba(34,211,238,0.1);
    border: 2px solid rgba(34,211,238,0.3);
    border-radius: 9999px;
    padding: 0.75rem 1.5rem;
    color: white;
    font-size: 1rem;
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

.send-button, .mic-button {
    background: transparent;
    border: 2px solid #22d3ee;
    color: white;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    padding: 0;
}

.send-button:hover, .mic-button:hover {
    background: rgba(34,211,238,0.2);
    transform: translateY(-2px);
}

.send-button svg, .mic-button svg {
    width: 16px;
    height: 16px;
}

.transcript-toggle {
    background: transparent;
    border: none;
    color: rgba(255,255,255,0.7);
    font-size: 0.9rem;
    cursor: pointer;
    padding: 0.5rem 1rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
}

.transcript-toggle:hover {
    color: white;
}

.transcript-toggle svg {
    width: 16px;
    height: 16px;
    transition: transform 0.2s;
}

.transcript-toggle.open svg {
    transform: rotate(180deg);
}

.chat-messages {
    width: 100%;
    max-width: 600px;
    max-height: 0;
    overflow: hidden;
    transition: all 0.3s ease-out;
}

.chat-messages.open {
    max-height: 300px;
    overflow-y: auto;
    padding: 1rem;
}

.chat-message {
    margin-bottom: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 0.75rem;
    color: white;
    font-size: 0.95rem;
    line-height: 1.4;
}

.chat-message.user {
    background: rgba(34,211,238,0.2);
    margin-left: 1.5rem;
    border-bottom-right-radius: 0.25rem;
}

.chat-message.assistant {
    background: rgba(0,0,0,0.3);
    margin-right: 1.5rem;
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
    1. Quotes and Motivation:
        - When sharing quotes, speak slowly and deliberately
        - Pause between sentences for emphasis
        - Add personal interpretation of the quote's meaning
        - Connect the quote to the user's current situation
        - Example: "Let me share this beautiful quote... [pause] 'The present moment is filled with joy and happiness. If you are attentive, you will see it.' [pause] - Thich Nhat Hanh"
    
    2. Calming Music:
        - Suggest specific calming music or sounds
        - Introduce the music with a short description and embed a youtube player to play the music
        - Primary suggestion: YouTube links to calming music (nature sounds, piano, etc.)
        - Ask about their music preferences for future suggestions
    
    3. Breathing Exercises (Instructor Mode):
        - Use a calm, measured instructor voice
        - Guide with clear, timed instructions
        - Example: "Let's begin... Sit comfortably... [2s pause] Now, breathe in slowly through your nose for 4 counts... [4s] Hold... [4s] And release slowly through your mouth for 6 counts..."
        - Check in during the exercise: "How are you feeling? Let's continue..."
        - End with gentle encouragement
    
    4. General Wellbeing:
        - Remember their goals
        - Celebrate small wins
        - Problem-solve challenges together
        - Share practical mindfulness techniques
    

    When talking do not say "pause" or "pause and think" or anything related to that.

    Make it sound to be a human, not a bot.

    If user ask for anything else, keep the conversation going, however, it's important to stay in topic regarding their mentail health. 
    Always maintain a natural conversation flow, showing genuine interest in their responses.
    End responses with gentle prompts to continue the conversation or try another activity.
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
        this.youtubePlayer = null;
        this.isYouTubeAPIReady = false;
        this.pendingVideoId = null;
        
        // Initialize YouTube API
        if (typeof YT === 'undefined') {
            window.onYouTubeIframeAPIReady = () => {
                this.isYouTubeAPIReady = true;
                if (this.pendingVideoId) {
                    this.playYoutubeVideo(this.pendingVideoId);
                }
            };
        }

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
            // Create overlay first
            this.createOverlay();

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

            const greeting = "Hi there, there's nothing to worry, and there's nothing to fix. Let's take a step back and relax. How can I help you today? Would you like to hear a motivational quote, listen to calming music, or try a breathing exercise together?";
            this.messages.push({ role: "assistant", content: greeting });
            this.updateChatDisplay();
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
                <h2 class="pause-subtitle">How can I help you feel better?</h2>
                <div class="pause-buttons">
                    <button class="pause-button" data-action="quotes">Get Some Quotes</button>
                    <button class="pause-button" data-action="audio">Listen to Audio</button>
                    <button class="pause-button" data-action="nature">Breathing Exercise</button>
                </div>
                <div id="youtube-player"></div>
                <div class="input-container">
                    <input type="text" class="pause-search" placeholder="Type your message...">
                    <button class="send-button">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                    </button>
                    <button class="mic-button">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </button>
                </div>
                <button class="transcript-toggle">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                    Show Transcript
                </button>
                <div class="chat-messages"></div>
            </div>
        `;

        // Add styles for new elements
        const style = document.createElement('style');
        style.textContent = `
            ${OVERLAY_STYLES}
            
            .input-container {
                width: 100%;
                max-width: 600px;
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1.5rem;
            }
            
            .send-button, .mic-button {
                background: transparent;
                border: 2px solid #22d3ee;
                color: white;
                width: 38px;
                height: 38px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .send-button:hover, .mic-button:hover {
                background: rgba(34,211,238,0.2);
                transform: translateY(-2px);
            }
            
            .send-button svg, .mic-button svg {
                width: 16px;
                height: 16px;
            }
            
            #youtube-player {
                width: 100%;
                max-width: 560px;
                margin: 20px auto;
                display: none;
            }
            
            .pause-search {
                flex: 1;
            }
        `;
        document.head.appendChild(style);

        // Add event listeners for new buttons
        const sendButton = overlay.querySelector('.send-button');
        const micButton = overlay.querySelector('.mic-button');
        const searchInput = overlay.querySelector('.pause-search');

        sendButton.addEventListener('click', () => {
            const input = searchInput.value.trim();
            if (input) {
                this.sendMessage(input);
                searchInput.value = '';
            }
        });

        searchInput.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
                await this.sendMessage(e.target.value.trim());
                e.target.value = '';
            }
        });

        micButton.addEventListener('click', () => {
            if (!this.context.isListening) {
                this.startVoiceRecognition();
            } else {
                this.stopVoiceRecognition();
            }
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

        // Add event listeners for buttons
        const actionButtons = overlay.querySelectorAll('.pause-button');
        actionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-action');
                this.handleButtonClick(action);
            });
        });

        this.overlayElement = overlay;
        document.body.appendChild(overlay);
    }

    startVoiceRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Sorry, voice recognition is not supported in your browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            this.context.isListening = true;
            const micButton = this.overlayElement.querySelector('.mic-button');
            micButton.style.background = 'rgba(34,211,238,0.3)';
        };

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            this.overlayElement.querySelector('.pause-search').value = text;
            this.sendMessage(text);
        };

        recognition.onend = () => {
            this.context.isListening = false;
            const micButton = this.overlayElement.querySelector('.mic-button');
            micButton.style.background = 'transparent';
        };

        recognition.start();
    }

    stopVoiceRecognition() {
        if (window.recognition) {
            window.recognition.stop();
        }
    }

    async playYoutubeVideo(videoId) {
        if (!videoId) return;

        // Load YouTube IFrame API if not already loaded
        if (typeof YT === 'undefined' || !YT.Player) {
            this.pendingVideoId = videoId;
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            return;
        }

        // Create or update player
        try {
            if (!this.youtubePlayer) {
                const playerDiv = document.getElementById('youtube-player');
                if (!playerDiv) return;

                playerDiv.style.cssText = 'height: 0; width: 0; visibility: hidden; position: absolute;';
                
                this.youtubePlayer = new YT.Player('youtube-player', {
                    height: '0',
                    width: '0',
                    videoId: videoId,
                    playerVars: {
                        'playsinline': 1,
                        'autoplay': 1,
                        'controls': 0,
                        'showinfo': 0,
                        'modestbranding': 1,
                        'loop': 1,
                        'playlist': videoId, // Required for looping
                        'fs': 0,
                        'cc_load_policy': 0,
                        'iv_load_policy': 3,
                        'autohide': 0
                    },
                    events: {
                        'onReady': (event) => {
                            event.target.playVideo();
                            console.log('YouTube player ready and playing');
                        },
                        'onStateChange': (event) => {
                            if (event.data === YT.PlayerState.ENDED) {
                                event.target.playVideo();
                            }
                            console.log('Player state changed:', event.data);
                        },
                        'onError': (event) => {
                            console.error('YouTube player error:', event.data);
                        }
                    }
                });
            } else {
                this.youtubePlayer.loadVideoById({
                    videoId: videoId,
                    startSeconds: 0,
                    suggestedQuality: 'small'
                });
            }
        } catch (error) {
            console.error('Error initializing YouTube player:', error);
        }
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
            const prompt = text.toLowerCase().includes('music') 
                ? "Please respond briefly about playing calming music."
                : `
                    Topic: ${this.context.currentTopic}
                    Mood: ${this.context.userMood}
                    User: ${text}
                    Please respond warmly and ask a follow-up question.
                `.trim();

            const res = await this.chatSession.sendMessage(prompt);
            const aiReply = await res.response.text();

            // Check if response contains YouTube video request
            const youtubeMatch = aiReply.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
            if (youtubeMatch) {
                this.playYoutubeVideo(youtubeMatch[1]);
            }

            this.messages.push({ role: "assistant", content: aiReply });
            this.updateContext(text, aiReply);
            this.speakText(aiReply);
            this.updateChatDisplay();
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    }

    updateChatDisplay() {
        if (!this.overlayElement) return;
        
        const chatMessages = this.overlayElement.querySelector('.chat-messages');
        if (!chatMessages) return;
        
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
        // Adjusted speech parameters for more natural sound
        utterance.pitch = 1.1;  // Slightly higher pitch
        utterance.rate = 0.9;   // Slightly slower rate
        utterance.volume = 0.9; // Slightly lower volume
        
        // Get all available voices and prefer natural-sounding ones
        const voices = this.synth.getVoices();
        const preferredVoices = voices.filter(voice => 
            /Samantha|Karen|Natural|Neural/.test(voice.name) && voice.lang.startsWith('en')
        );
        
        utterance.voice = preferredVoices[0] || voices[0];
        
        // Add slight pauses at punctuation for more natural rhythm
        text = text.replace(/([.,!?])/g, '$1...');
        
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
            audio: "Play some calming background music.",
            nature: "Guide me through a breathing exercise."
        };

        if (action === 'audio') {
            console.log('Audio button clicked');
            // Simple audio implementation first
            const audio = new Audio('https://www.youtube.com/watch?v=cI4ryatVkKw');
            audio.play().catch(error => {
                console.error('Error playing audio:', error);
                // Fallback to simple message if audio fails
                this.messages.push({ 
                    role: "assistant", 
                    content: "I apologize, but I'm having trouble playing the audio right now. Would you like to try something else?" 
                });
                this.updateChatDisplay();
            });
            
            this.messages.push({ 
                role: "assistant", 
                content: "Playing some calming background music for you." 
            });
            this.updateChatDisplay();
            return;
        }

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
            // Stop any ongoing speech
            if (this.synth.speaking) {
                this.synth.cancel();
                this.context.isSpeaking = false;
            }
            
            // Stop any playing video/audio
            if (this.youtubePlayer) {
                this.youtubePlayer.stopVideo();
            }
            
            // Stop voice recognition if active
            this.stopVoiceRecognition();
            
            this.overlayElement.style.opacity = '0';
            setTimeout(() => {
                this.overlayElement.style.display = 'none';
                console.log('[Pause] Overlay hidden');
            }, 300);
        }
    }
}

export default ChatOverlay; 