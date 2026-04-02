// main.js - SPA + Utility Bar + Web App Mode

// Detect if running as standalone web app
function isWebAppMode() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// Load the navigation bar
async function loadNav() {
  const res = await fetch("/components/nav.html");
  const data = await res.text();
  document.getElementById("nav-container").innerHTML = data;

  // Highlight the active icon
  const icons = document.querySelectorAll(".utility-icon");
  const currentPath = window.location.pathname;

  icons.forEach(icon => {
    const iconPath = new URL(icon.href, location.origin).pathname;
    if (iconPath === currentPath) {
      icon.classList.add("active");
    }
  });
}

// Load page content dynamically
async function loadPage(path) {
  const mainSection = document.querySelector("main");
  
  // Fade out current content
  mainSection.style.opacity = "0";
  mainSection.style.transform = "translateY(8px) scale(0.985)";
  mainSection.style.filter = "blur(1.5px)";
  
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("Page not found");
    const html = await res.text();
    
    // Parse fetched HTML and extract <main> content
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const newMain = doc.querySelector("main");
    
    // Replace content
    setTimeout(() => {
      mainSection.innerHTML = newMain.innerHTML;

      // Fade in new content
      mainSection.style.opacity = "1";
      mainSection.style.transform = "translateY(0) scale(1)";
      mainSection.style.filter = "blur(0)";
      
      // Re-run any scripts for new content
      setupUI();
    }, 200);
  } catch (err) {
    console.error("Failed to load page:", err);
  }
}

// Setup link clicks and utility bar behavior
function setupUI() {
  // Links inside main should load dynamically
  document.querySelectorAll("a").forEach(link => {
    if (link.hostname === window.location.hostname) {
      link.addEventListener("click", e => {
        const target = link.getAttribute("href");
        if (!target || target === "#") return;
        e.preventDefault();
        loadPage(target);
        // Update browser history
        window.history.pushState({}, "", target);
      });
    }
  });

  // Utility icon active handling
  const icons = document.querySelectorAll(".utility-icon");
  icons.forEach(icon => {
    icon.addEventListener("click", () => {
      icons.forEach(i => i.classList.remove("active"));
      icon.classList.add("active");
    });
  });

  // Auto-toggle Web App mode if running as standalone
  const webAppCheckbox = document.querySelector('input[type="checkbox"][id="webapp-toggle"]');
  if (webAppCheckbox) webAppCheckbox.checked = isWebAppMode();
}

// Handle browser back/forward buttons
window.addEventListener("popstate", () => {
  loadPage(window.location.pathname);
});

// Initial page load
document.addEventListener("DOMContentLoaded", () => {
  loadNav();
  setupUI();
});
