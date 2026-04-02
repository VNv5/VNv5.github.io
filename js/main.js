// 🔍 Detect Web App vs Browser
function isWebApp() {
  return window.matchMedia('(display-mode: standalone)').matches 
    || window.navigator.standalone === true;
}

// Load navigation bar
async function loadNav() {
  const res = await fetch("/components/nav.html");
  const data = await res.text();
  document.getElementById("nav-container").innerHTML = data;

  const icons = document.querySelectorAll(".utility-icon");
  const currentPath = window.location.pathname;

  icons.forEach(icon => {
    const iconPath = new URL(icon.href).pathname;
    if (iconPath === currentPath) {
      icon.classList.add("active");
    }
  });

  setupTransitions();
}

// Page transitions
function setupTransitions() {
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
        }, 500);
      });
    }
  });
}

// Init everything
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("fade-out");
  document.body.classList.add("fade-in");

  // 🔥 Detect mode ONCE globally
  if (isWebApp()) {
    document.body.classList.add("webapp-mode");
  } else {
    document.body.classList.add("browser-mode");
  }

  loadNav();
  setupTransitions();
});
