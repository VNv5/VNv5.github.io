// main.js

// Detect if running as a standalone web app
function isWebApp() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

// Automatically toggle Web-App Mode if running as a standalone web app
function autoToggleWebAppMode() {
  const webAppToggle = document.querySelector('input[type="checkbox"][data-webapp-toggle]');
  if (webAppToggle) {
    webAppToggle.checked = isWebApp();
  }
}

// Setup utility bar active icons
function setupUtilityBar() {
  const icons = document.querySelectorAll(".utility-icon");
  const currentPath = window.location.pathname;

  icons.forEach(icon => {
    const iconPath = new URL(icon.href).pathname;
    if (iconPath === currentPath) {
      icon.classList.add("active");
    }
  });
}

// Setup page fade transitions for links (except in standalone web app)
function setupTransitions() {
  if (isWebApp()) return; // Skip dynamic transitions in web-app mode

  document.querySelectorAll("a").forEach(link => {
    if (link.hostname === window.location.hostname) {
      link.addEventListener("click", function (e) {
        const target = this.href;
        const current = window.location.href;
        if (target === current || this.getAttribute("href") === "#") return;

        e.preventDefault();

        document.body.classList.remove("fade-in");
        document.body.classList.add("fade-out");

        setTimeout(() => {
          window.location.href = target;
        }, 400); // shorter fade
      });
    }
  });
}

// Initialize everything on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("fade-in");

  setupUtilityBar();
  setupTransitions();
  autoToggleWebAppMode();
});
