// main.js

let isWebApp = false;

function detectWebAppMode() {
  isWebApp =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  const webAppToggle = document.querySelector("#webapp-toggle input");
  if (webAppToggle) webAppToggle.checked = isWebApp;
}

async function loadNav() {
  const navContainer = document.getElementById("nav-container");
  if (!navContainer) return;

  try {
    const res = await fetch("/components/nav.html");
    const data = await res.text();
    navContainer.innerHTML = data;

    const icons = document.querySelectorAll(".utility-icon");
    const currentPath = window.location.pathname;
    icons.forEach((icon) => {
      const iconPath = new URL(icon.href).pathname;
      if (iconPath === currentPath) icon.classList.add("active");
    });
  } catch (err) {
    console.warn("Could not load nav:", err);
  }
}

// Only fetch pages on link click, not on first load
async function loadPage(path) {
  if (window.location.pathname === path) return; // Already here
  if (isWebApp) return; // Don't fetch in standalone web app

  const mainSection = document.querySelector("main");
  if (!mainSection) return;

  // Animate out
  mainSection.style.transition =
    "opacity 0.2s ease, transform 0.2s ease, filter 0.2s ease";
  mainSection.style.opacity = "0";
  mainSection.style.transform = "translateY(8px) scale(0.985)";
  mainSection.style.filter = "blur(1.5px)";

  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error("Page not found");
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const newMain = doc.querySelector("main");
    if (!newMain) throw new Error("<main> not found");

    setTimeout(() => {
      mainSection.innerHTML = newMain.innerHTML;
      mainSection.style.opacity = "1";
      mainSection.style.transform = "translateY(0) scale(1)";
      mainSection.style.filter = "blur(0)";
      setupUI();
    }, 200);

    window.history.pushState({}, "", path);
  } catch (err) {
    console.warn("Could not fetch page, keeping current content.", err);
    // Animate back in if failed
    mainSection.style.opacity = "1";
    mainSection.style.transform = "translateY(0) scale(1)";
    mainSection.style.filter = "blur(0)";
  }
}

function setupTransitions() {
  document.querySelectorAll("a").forEach((link) => {
    if (link.hostname === window.location.hostname) {
      link.addEventListener("click", function (e) {
        const target = this.href;
        e.preventDefault();
        loadPage(target);
      });
    }
  });
}

function setupUI() {
  detectWebAppMode();
  // any UI initialization here
}

window.addEventListener("popstate", () => {
  loadPage(window.location.pathname);
});

document.addEventListener("DOMContentLoaded", () => {
  detectWebAppMode();
  loadNav();
  setupTransitions();
  setupUI();

  // Fade in body
  document.body.style.transition = "opacity 0.4s ease";
  document.body.style.opacity = "1";
});
