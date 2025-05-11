// document.body.style.backgroundColor = "#f0f8ff"; // Light blue
// // Create a banner element
// const banner = document.createElement("div");
// banner.style.position = "fixed";
// banner.style.top = "0";
// banner.style.left = "0";
// banner.style.width = "100%";
// banner.style.backgroundColor = "#ffcc00"; // Yellow
// banner.style.color = "#000";
// banner.style.textAlign = "center";
// banner.style.padding = "10px";
// banner.style.zIndex = "1000";
// banner.innerText = "Take a mindful pause!";

// // Add the banner to the page
// document.body.prepend(banner);

// // Replace all text on the page with a mindfulness message
// document.body.innerHTML = "<h1 style='text-align: center; margin-top: 20%;'>Take a mindful pause!</h1>";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startScan") {
    // Clear the existing content
    document.body.innerHTML = "";

    // Set up body styles
    document.body.style.margin = "0";
    document.body.style.height = "100vh";
    document.body.style.overflow = "hidden";
    // Set backgroundColor to transparent for full transparency
    document.body.style.backgroundColor = "transparent";
    document.body.style.color = "transparent";
    document.body.style.display = "flex";
    document.body.style.alignItems = "center";
    document.body.style.justifyContent = "center";

    // Create a wrapper div with a gradient border and backdrop blur
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.width = "100vw";
    wrapper.style.height = "100vh";
    wrapper.style.boxSizing = "border-box";
    wrapper.style.border = "10px solid transparent";
    // Change the gradient to the original colors
    wrapper.style.borderImage = "linear-gradient(45deg, #064877, #16FE9D) 1";
    // Set backgroundColor to transparent for the wrapper as well
    wrapper.style.backgroundColor = "transparent";
    // wrapper.style.backdropFilter = "blur(10px)";
    wrapper.style.borderRadius = "20px";

    // Create an overlay element for the inner shadow (without border radius)
    const innerShadow = document.createElement("div");
    innerShadow.style.position = "absolute";
    innerShadow.style.top = "0";
    innerShadow.style.left = "0";
    innerShadow.style.width = "100%";
    innerShadow.style.height = "100%";
    innerShadow.style.pointerEvents = "none";
    // Apply the inner shadow with desired properties: color #03AACE at 50% opacity, blur 250px, spread 70px
    innerShadow.style.boxShadow = "inset 0 0 250px 70px rgba(3, 170, 206, 0.5)";

    // Append only the inner shadow to the wrapper (removed noise overlay)
    wrapper.appendChild(innerShadow);

    document.body.appendChild(wrapper);
  }

});
