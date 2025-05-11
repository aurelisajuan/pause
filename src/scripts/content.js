const style = document.createElement('style');
style.textContent = `
@keyframes pause-rotate {
    0% { border-image: linear-gradient(0deg, #064877, #16FE9D) 1; }
    100% { border-image: linear-gradient(360deg, #064877, #16FE9D) 1; }
}

.pause-scanning-container {
    background: #101914;
    border: 2px solid rgba(34,211,238,0.4);
    border-radius: 32px;
    padding: 1rem 1.5rem;
    text-align: center;
    position: relative;
    z-index: 2;
}

.pause-scanning-title {
    color: #22d3ee;
    margin-bottom: 8px;
    font-size: 24px;
    font-weight: 600;
}

.pause-scanning-text {
    color: #94a3b8;
    font-size: 16px;
}
`;
document.head.appendChild(style);

let chatOverlay = null;

// Function to show scanning animation
function showScanningAnimation(duration = 3000) {
    console.log(`[Pause] Starting scanning animation with duration: ${duration}ms`);
    
    return new Promise((resolve) => {
        // Create scanning container
        const container = document.createElement('div');
        container.className = 'pause-scanning-container';
        container.innerHTML = `
            <h2 class="pause-scanning-title">Scanning the page…</h2>
        `;

        // Create overlay wrapper with rotating gradient border
        const wrapper = document.createElement('div');
        wrapper.id = 'pause-scanning-overlay';
        Object.assign(wrapper.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            boxSizing: "border-box",
            border: "10px solid transparent",
            borderRadius: "20px",
            backgroundColor: "rgba(16, 25, 20, 0.95)",
            zIndex: "999999",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, -apple-system, sans-serif",
            opacity: "0",
            transition: "opacity 0.3s ease-in-out",
            animation: "pause-rotate 4s linear infinite"
        });

        // Inner shadow layer
        const innerShadow = document.createElement('div');
        Object.assign(innerShadow.style, {
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            boxShadow: "inset 0 0 250px 70px rgba(3, 170, 206, 0.5)"
        });

        wrapper.appendChild(innerShadow);
        wrapper.appendChild(container);
        document.body.appendChild(wrapper);

        // Trigger fade in
        requestAnimationFrame(() => {
            wrapper.style.opacity = '1';
            console.log('[Pause] Scanning overlay faded in');
        });

        // After duration, fade out and remove
        setTimeout(() => {
            console.log('[Pause] Starting scan fade out');
            wrapper.style.opacity = '0';
            setTimeout(() => {
                wrapper.remove();
                console.log('[Pause] Scanning overlay removed');
                resolve();
            }, 300); // 300ms for fade out
        }, duration);
    });
}

// Initialize chat overlay
async function initializeChatOverlay() {
    console.log('[Pause] Initializing chat overlay');
    try {
        if (!chatOverlay) {
            // Try to import using different possible paths
            let ChatOverlayClass;
            try {
                const module = await import('./ChatOverlay.js');
                ChatOverlayClass = module.default;
            } catch (e) {
                console.error('[Pause] Failed to import from ./ChatOverlay.js:', e);
                try {
                    const module = await import('../scripts/ChatOverlay.js');
                    ChatOverlayClass = module.default;
                } catch (e2) {
                    console.error('[Pause] Failed to import from ../scripts/ChatOverlay.js:', e2);
                    throw new Error('Could not import ChatOverlay module');
                }
            }

            console.log('[Pause] ChatOverlay class imported');
            chatOverlay = new ChatOverlayClass();
            console.log('[Pause] ChatOverlay instance created');
            
            await chatOverlay.initialize();
            console.log('[Pause] ChatOverlay initialized');
        }
        return chatOverlay;
    } catch (error) {
        console.error('[Pause] Error initializing chat overlay:', error);
        throw error;
    }
}

// Handle messages from popup/background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startScan") {
        console.log('[Pause] Received startScan message');
        
        // Immediately send response to avoid connection issues
        sendResponse({ status: "starting" });

        // Execute the scanning and chat sequence
        (async () => {
            try {
                const duration = message.glowDuration || 3000;
                console.log(`[Pause] Starting scan sequence with ${duration}ms duration`);
                
                await showScanningAnimation(duration);
                console.log('[Pause] Scan animation completed');
                
                const overlay = await initializeChatOverlay();
                console.log('[Pause] Chat overlay ready');
                
                // Ensure we're showing the overlay
                if (overlay && typeof overlay.show === 'function') {
                    overlay.show();
                    console.log('[Pause] Chat overlay shown');
                } else {
                    console.error('[Pause] Invalid overlay object:', overlay);
                }
            } catch (error) {
                console.error("[Pause] Error in scan sequence:", error);
                // Try to show an error message to the user
                alert("An error occurred while loading the chat. Please refresh and try again.");
            }
        })();

        return true; // Keep the message channel open for the async response
    }
});
