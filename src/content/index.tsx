import React from "react";
const ReactDOM = require("react-dom");
import GlowOverlay from "./GlowPage";

let overlayRoot: HTMLDivElement | null = null;

function mountOverlay() {
    if (overlayRoot) return;
    overlayRoot = document.createElement("div");
    document.body.appendChild(overlayRoot);
    ReactDOM.render(<GlowOverlay />, overlayRoot);
}

function unmountOverlay() {
    if (overlayRoot) {
        ReactDOM.unmountComponentAtNode(overlayRoot);
        overlayRoot.remove();
        overlayRoot = null;
    }
}

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "TRIGGER_SCAN") {
        mountOverlay();
    }
    if (msg.type === "REMOVE_SCAN") {
        unmountOverlay();
    }
});
