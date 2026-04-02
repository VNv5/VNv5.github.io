// main.js

// --- Global Variables ---
let isWebApp = false;

// --- Detect if running as a web app ---
function detectWebAppMode() {
  isWebApp = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const webAppToggle = document.querySelector("#webapp-toggle input");
  if (webAppToggle) webAppToggle.checked = isWebApp;
}

// --- Initialize Utility Bar ---
async function loadNav() {
  const navContainer = document.getElementById("nav-container");
  if (!navContainer) return;

  try {
    const res = await fetch("/components/nav.html");
    if (!res.ok) throw new Error("Nav not found");
    const data = await res.text();
    navContainer.innerHTML = data;

    // Highlight active icon
    const icons = document.querySelectorAll(".utility-icon");
    const currentPath = window.location.pathname;
    icons.forEach(icon => {
      const iconPath = new URL(icon.href).pathname;
      if (iconPath === currentPath) icon.classList.add("active");
    });

  } catch (err) {
    console.warn("Could not load nav:", err);
  }
}

// --- SPA Page Loader with Fallback ---
async function loadPage(path) {
  const mainSection = document.querySelector("main");
  if (!mainSection) return;

  // Fade out current content
  mainSection.style.transition = "opacity 0.2s ease, transform 0.2s ease, filter 0.2s ease";
  mainSection.style.opacity = "0";
  mainSection.style.transform = "translateY(8px) scale(0.985)";
  mainSection.style.filter = "blur(1.5px)";

  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("Page not found");
    const html = await res.text();

    // Extract <main> content
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const newMain = doc.querySelector("main");
    if (!newMain) throw new Error("<main> not found in page");

    setTimeout(() => {
      mainSection.innerHTML = newMain.innerHTML;
      mainSection.style.opacity = "1";
      mainSection.style.transform = "translateY(0) scale(1)";
      mainSection.style.filter = "blur(0)";
      setupUI();
    }, 200);

    // Update browser history if not in standalone mode
    if (!isWebApp) window.history.pushState({}, "", path);

  } catch (err) {
    // Fallback: keep current content for standalone apps / local files
    console.warn("Could not fetch page, using current content:", err);
    mainSection.style.opacity = "1";
    mainSection.style.transform = "translateY(0) scale(1)";
    mainSection.style.filter = "blur(0)";
  }
}

// --- Setup SPA Links ---
function setupTransitions() {
  document.querySelectorAll("a").forEach(link => {
    if (link.hostname === window.location.hostname) {
      link.addEventListener("click", function(e) {
        const target = this.href;
        const current = window.location.href;
        if (target === current || this.getAttribute("href") === "#") return;

        e.preventDefault();
        loadPage(target);
      });
    }
  });
}

// --- Setup UI Components after load ---
function setupUI() {
  // Reattach any toggle events, buttons, etc.
  detectWebAppMode(); // Auto-toggle web app mode
}

// --- Handle Browser Back/Forward ---
window.addEventListener("popstate", () => {
  loadPage(window.location.pathname);
});

// --- DOM Ready ---
document.addEventListener("DOMContentLoaded", () => {
  detectWebAppMode();
  loadNav();
  setupTransitions();

  // Initial fade-in
  document.body.style.transition = "opacity 0.4s ease";
  document.body.style.opacity = "1";
});
