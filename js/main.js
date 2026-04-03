// main.js

let cloakWindow = null;
let cloakPrimed = false;

// 🔹 Load Nav
async function loadNav() {
  const res = await fetch("/components/nav.html");
  const data = await res.text();
  document.getElementById("nav-container").innerHTML = data;

  const icons = document.querySelectorAll(".utility-icon");
  const currentPath = window.location.pathname;
  icons.forEach(icon => {
    const iconPath = new URL(icon.href).pathname;
    if (iconPath === currentPath) icon.classList.add("active");
  });

  setupTransitions();
}

// 🔹 Page transitions (UNCHANGED)
function setupTransitions() {
  document.querySelectorAll("a").forEach(link => {
    if (link.hostname === window.location.hostname) {
      link.addEventListener("click", function(e) {
        if (this.closest('.utility-bar')) return;

        const target = this.href;
        if (target === window.location.href || this.getAttribute("href") === "#") return;

        e.preventDefault();
        document.body.classList.remove("fade-in");
        document.body.classList.add("fade-out");

        setTimeout(() => window.location.href = target, 500);
      });
    }
  });
}

// 🔹 Detect web app
function detectWebAppMode() {
  return window.matchMedia('(display-mode: standalone)').matches
       || window.navigator.standalone === true;
}

// 🔹 Popup
function showPopup(msg) {
  const popup = document.getElementById('settings-popup');
  popup.querySelector('#popup-message').textContent = msg;
  popup.classList.add('show');
}

// 🔥 REAL MOBILE ABOUT:BLANK CLOAK
function openCloak() {

  // FIRST CLICK → open blank tab instantly
  if (!cloakPrimed) {
    cloakWindow = window.open('about:blank', '_blank');

    if (!cloakWindow) {
      showPopup('Allow popups and try again.');
      return;
    }

    cloakPrimed = true;
    return;
  }

  // SECOND CLICK → WRITE into that tab (THIS is the fix)
  if (cloakWindow && !cloakWindow.closed) {
    const url = window.location.origin + "/settings/index.html";

    cloakWindow.document.open();
    cloakWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Settings</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            html, body {
              margin: 0;
              height: 100%;
              background: #0f0f0f;
            }
            iframe {
              width: 100%;
              height: 100%;
              border: none;
            }
          </style>
        </head>
        <body>
          <iframe src="${url}"></iframe>
        </body>
      </html>
    `);
    cloakWindow.document.close();

    // redirect current tab AFTER writing
    window.location.replace("https://www.ixl.com");
  }
}

// 🔹 DOM Ready
window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("fade-in");
  loadNav();

  const isWebApp = detectWebAppMode();
  const cloakButton = document.querySelector('.setting-card:first-child button');
  const autoCloakToggle = document.querySelector('.setting-card:nth-child(2) input[type="checkbox"]');
  const panicButtonToggle = document.querySelector('.setting-card:nth-child(3) input[type="checkbox"]');
  const webAppToggle = document.querySelector('.setting-card:nth-child(4) input[type="checkbox"]');

  document.getElementById('popup-close').addEventListener('click', () => {
    document.getElementById('settings-popup').classList.remove('show');
  });

  if (isWebApp) {
    webAppToggle.checked = true;
    webAppToggle.disabled = true;
  } else {
    webAppToggle.checked = false;
    webAppToggle.disabled = true;
  }

  // 🔥 CLOAK BUTTON (NO DELAYS, NO TRANSITIONS)
  if (cloakButton) {
    cloakButton.addEventListener('click', () => {
      if (!webAppToggle.checked) {
        openCloak();
      } else {
        showPopup('This Setting Cannot Be Activated Due To Web-App Mode');
      }
    });
  }

  // 🔹 Auto Cloak
  if (autoCloakToggle) {
    autoCloakToggle.checked = localStorage.getItem('autoCloak') === 'true';

    autoCloakToggle.addEventListener('change', () => {
      localStorage.setItem('autoCloak', autoCloakToggle.checked);

      if (autoCloakToggle.checked && !webAppToggle.checked) {
        openCloak();
      }
    });

    if (autoCloakToggle.checked && !webAppToggle.checked) {
      openCloak();
    }
  }

  // 🔹 Panic toggle
  if (panicButtonToggle) {
    panicButtonToggle.checked = localStorage.getItem('panicButton') === 'true';
    panicButtonToggle.addEventListener('change', () => {
      localStorage.setItem('panicButton', panicButtonToggle.checked);
    });
  }
});
