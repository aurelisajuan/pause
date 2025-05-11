document.body.style.backgroundColor = "#f0f8ff"; // Light blue
// Create a banner element
const banner = document.createElement("div");
banner.style.position = "fixed";
banner.style.top = "0";
banner.style.left = "0";
banner.style.width = "100%";
banner.style.backgroundColor = "#ffcc00"; // Yellow
banner.style.color = "#000";
banner.style.textAlign = "center";
banner.style.padding = "10px";
banner.style.zIndex = "1000";
banner.innerText = "Take a mindful pause!";

// Add the banner to the page
document.body.prepend(banner);

// Replace all text on the page with a mindfulness message
document.body.innerHTML = "<h1 style='text-align: center; margin-top: 20%;'>Take a mindful pause!</h1>";
