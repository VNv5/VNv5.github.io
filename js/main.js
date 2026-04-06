/* ===== NAV ===== */
async function loadNav() {
  const res  = await fetch("/components/nav.html");
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

/* ===== PAGE TRANSITIONS ===== */
function setupTransitions() {
  document.querySelectorAll("a").forEach(link => {
    if (link.hostname !== window.location.hostname) return;
    link.addEventListener("click", function(e) {
      if (this.closest('.utility-bar')) return;
      const target  = this.href;
      const current = window.location.href;
      if (target === current || this.getAttribute("href") === "#") return;

      e.preventDefault();
      document.body.classList.remove("fade-in");
      document.body.classList.add("fade-out");
      setTimeout(() => { window.location.href = target; }, 500);
    });
  });
}

/* ===== WEB APP DETECTION ===== */
function detectWebAppMode() {
  return window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true;
}

/* ===== CLOAK ===== */
function openCloak() {
  var win = window.open("", "_blank");
  if (!win) {
    // Popup blocked — redirect current tab instead
    window.location.replace("https://google.com");
    return;
  }
  var iframe = win.document.createElement("iframe");
  iframe.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;border:none;";
  iframe.src = "https://vnv5.github.io";
  win.document.body.style.margin = "0";
  win.document.body.style.height = "100vh";
  win.document.body.appendChild(iframe);
  win.document.title = "Google Docs";

  // Redirect original tab to Google so it doesn't sit on the site
  window.location.replace("https://google.com");
}

// Auto cloak: window.open() is blocked by browsers on page load without
// a user gesture. Fix: show a fake "loading" overlay immediately —
// when the user taps it (counts as a gesture) the cloak fires.
function maybeAutoCloak() {
  if (localStorage.getItem("autoCloak") !== "true") return;

  // Build overlay
  const overlay = document.createElement("div");
  overlay.id = "cloak-overlay";
  overlay.style.cssText = [
    "position:fixed",
    "inset:0",
    "background:#fff",
    "z-index:99999",
    "display:flex",
    "flex-direction:column",
    "justify-content:center",
    "align-items:center",
    "cursor:pointer",
    "font-family:arial,sans-serif",
    "color:#444",
    "user-select:none",
    "-webkit-user-select:none"
  ].join(";");

  // Looks like a generic Google loading screen
  overlay.innerHTML = `
    <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
         style="width:180px;margin-bottom:32px;opacity:0.9">
    <div style="width:40px;height:40px;border:4px solid #f3f3f3;border-top:4px solid #4285f4;
                border-radius:50%;animation:spin 0.8s linear infinite;"></div>
    <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
  `;

  document.body.appendChild(overlay);

  // Any interaction triggers the cloak
  function triggerCloak() {
    overlay.removeEventListener("click",      triggerCloak);
    overlay.removeEventListener("touchstart", triggerCloak);
    openCloak();
  }

  overlay.addEventListener("click",      triggerCloak);
  overlay.addEventListener("touchstart", triggerCloak, { passive: true });
}

// Expose globally so settings page inline onclick can call it
window.openCloak = openCloak;

/* ===== PANIC BUTTON LOADER ===== */
function loadPanicButton() {
  const enabled = localStorage.getItem("panicEnabled") === "true";
  if (!enabled) return;

  // Don't inject twice if already on page
  if (document.getElementById("panic-btn")) return;

  // Inject stylesheet if not already present
  if (!document.querySelector('link[href="/css/panic.css"]')) {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "/css/panic.css";
    document.head.appendChild(link);
  }

  // Inject script
  const script = document.createElement("script");
  script.src = "/js/panic.js";
  document.body.appendChild(script);
}

/* ===== INIT ===== */
window.onload = () => {
  document.body.classList.add("fade-in");
  loadNav();
  setupTransitions();
  loadPanicButton();
  maybeAutoCloak();

  const isWebApp = detectWebAppMode();

  /* -- Settings page elements (null-safe, only exist on settings page) -- */
  const cloakButton      = document.querySelector('.setting-card:first-child button');
  const autoCloakToggle  = document.querySelector('.setting-card:nth-child(2) input[type="checkbox"]');
  const panicToggle      = document.querySelector('.setting-card:nth-child(3) input[type="checkbox"]');
  const webAppToggle     = document.querySelector('.setting-card:nth-child(4) input[type="checkbox"]');

  const popup        = document.getElementById('settings-popup');
  const popupMessage = document.getElementById('popup-message');
  const popupClose   = document.getElementById('popup-close');

  function showPopup(msg) {
    if (!popup || !popupMessage) return;
    popupMessage.textContent = msg;
    popup.classList.add('show');
  }

  if (popupClose) popupClose.addEventListener('click', () => popup.classList.remove('show'));

  /* -- Web App Mode toggle -- */
  if (isWebApp) {
    if (webAppToggle) {
      webAppToggle.checked  = true;
      webAppToggle.disabled = true;
      webAppToggle.addEventListener('click', () => {
        showPopup('Web-App Mode cannot be turned off while in standalone mode.');
      });
    }
  } else if (webAppToggle) {
    webAppToggle.checked  = false;
    webAppToggle.disabled = true;
  }

  /* -- Cloak / Auto Cloak blocked in Web App Mode -- */
  [cloakButton, autoCloakToggle].forEach(el => {
    if (!el) return;
    el.addEventListener('click', e => {
      if (webAppToggle?.checked) {
        e.preventDefault();
        if (el.type === 'checkbox') el.checked = false;
        showPopup('This Setting Cannot Be Activated Due To Web-App Mode');
      }
    });
  });

  if (autoCloakToggle) {
    autoCloakToggle.checked = localStorage.getItem("autoCloak") === "true";
    autoCloakToggle.addEventListener("change", () => {
      if (!webAppToggle?.checked) {
        localStorage.setItem("autoCloak", autoCloakToggle.checked);
      } else {
        autoCloakToggle.checked = false;
        showPopup("This Setting Cannot Be Activated Due To Web-App Mode");
      }
    });
  }

  /* -- Panic Button toggle -- */
  if (panicToggle) {
    // Sync checkbox to saved state (key: panicEnabled — matches panic.js)
    panicToggle.checked = localStorage.getItem("panicEnabled") === "true";

    panicToggle.addEventListener('change', () => {
      localStorage.setItem("panicEnabled", panicToggle.checked);

      if (panicToggle.checked) {
        // Load panic button immediately without requiring page reload
        loadPanicButton();
      } else {
        // Hide it immediately; full removal happens on next page load
        const panicBtn = document.getElementById("panic-btn");
        if (panicBtn) panicBtn.style.display = "none";
      }

      // Tell panic.js to re-read settings if it's already loaded
      window.dispatchEvent(new Event("panicSettingsChanged"));
    });
  }
};
