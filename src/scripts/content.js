chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startScan") {
    // Remove any existing overlay
    const existing = document.getElementById("pause-overlay");
    if (existing) existing.remove();

    // Create overlay wrapper with transparent background
    const wrapper = document.createElement("div");
    wrapper.id = "pause-overlay";
    Object.assign(wrapper.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      boxSizing: "border-box",
      border: "10px solid transparent",
      borderRadius: "20px",
      backgroundColor: "transparent",
      pointerEvents: "none",
      zIndex: "999999"
    });

    // Inject animated border styles if not already
    if (!document.getElementById("pause-overlay-style")) {
      const style = document.createElement("style");
      style.id = "pause-overlay-style";
      style.textContent = `
        @keyframes pause-rotate {
          0% { border-image: linear-gradient(0deg, #064877, #16FE9D) 1; }
          100% { border-image: linear-gradient(360deg, #064877, #16FE9D) 1; }
        }
        #pause-overlay {
          animation: pause-rotate 4s linear infinite;
        }
      `;
      document.head.appendChild(style);
    }

    // Inner shadow layer
    const innerShadow = document.createElement("div");
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

    document.body.appendChild(wrapper);
  }
});
