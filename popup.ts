interface PauseState {
    isActive: boolean;
    lastPauseTime: number;
}

// Initialize state
let pauseState: PauseState = {
    isActive: false,
    lastPauseTime: 0
};

// DOM Elements
const startPauseBtn = document.getElementById('startPause') as HTMLButtonElement;
const instructionsBtn = document.getElementById('instructionsBtn') as HTMLButtonElement;
const settingsBtn = document.getElementById('settingsBtn') as HTMLButtonElement;

// Event Listeners
startPauseBtn?.addEventListener('click', () => {
    // TODO: Implement pause functionality
    console.log('Starting pause...');
    // This will be implemented to show the pause animation/experience
});

instructionsBtn?.addEventListener('click', () => {
    // TODO: Show instructions modal
    console.log('Showing instructions...');
    // This will be implemented to show the instructions page
});

settingsBtn?.addEventListener('click', () => {
    // TODO: Show settings modal
    console.log('Showing settings...');
    // This will be implemented to show the settings page
});

// Load saved state from storage
chrome.storage.local.get(['pauseState'], (result) => {
    if (result.pauseState) {
        pauseState = result.pauseState;
        updateUI();
    }
});

// Update UI based on state
function updateUI() {
    if (pauseState.isActive) {
        startPauseBtn.textContent = 'End Pause';
        startPauseBtn.classList.add('bg-red-600');
        startPauseBtn.classList.remove('bg-slate-800');
    } else {
        startPauseBtn.textContent = 'Start Pause';
        startPauseBtn.classList.add('bg-slate-800');
        startPauseBtn.classList.remove('bg-red-600');
    }
}

// Save state to storage
function saveState() {
    chrome.storage.local.set({ pauseState });
} 