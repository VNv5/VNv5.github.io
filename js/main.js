// main.js

// 🔹 Load the utility bar / nav
async function loadNav() {
  const res = await fetch("/components/nav.html");
  const data = await res.text();
  document.getElementById("nav-container").innerHTML = data;

  // Highlight the current icon
  const icons = document.querySelectorAll(".utility-icon");
  const currentPath = window.location.pathname;

  icons.forEach(icon => {
    const iconPath = new URL(icon.href).pathname;
    if (iconPath === currentPath) icon.classList.add("active");
  });

  // Attach page transitions AFTER nav loads
  setupTransitions();
}

// 🔹 Smooth page transitions
function setupTransitions() {
  document.querySelectorAll("a").forEach(link => {
    if (link.hostname === window.location.hostname) {
      link.addEventListener("click", function(e) {
        if (this.closest('.utility-bar')) return;
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

// 🔹 Detect if site is running as a mobile web app
function detectWebAppMode() {
  return window.matchMedia('(display-mode: standalone)').matches
       || window.navigator.standalone === true;
}

// 🔹 Popup Utility
function showPopup(msg) {
  const popup = document.getElementById('settings-popup');
  const popupMessage = document.getElementById('popup-message');
  popupMessage.textContent = msg;
  popup.classList.add('show');
}

// 🔹 Cloak Function using about:blank
function openCloak() {
  const newTab = window.open('about:blank', '_blank');
  if (newTab) {
    // Clone current page's HTML into the new tab
    newTab.document.write('<!DOCTYPE html>' + document.documentElement.outerHTML);
    newTab.document.close();

    // Redirect original tab
    window.location.href = 'https://www.google.com';
  } else {
    showPopup('Popup blocked! Please allow popups to use Cloak.');
  }
}

// 🔹 DOM Ready
window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("fade-in");

  loadNav();
  setupTransitions();

  const isWebApp = detectWebAppMode();

  const cloakButton = document.querySelector('.setting-card:first-child button');
  const autoCloakToggle = document.querySelector('.setting-card:nth-child(2) input[type="checkbox"]');
  const panicButtonToggle = document.querySelector('.setting-card:nth-child(3) input[type="checkbox"]');
  const webAppToggle = document.querySelector('.setting-card:nth-child(4) input[type="checkbox"]');

  const popupClose = document.getElementById('popup-close');
  popupClose.addEventListener('click', () => document.getElementById('settings-popup').classList.remove('show'));

  // Web-App Mode settings
  if (isWebApp) {
    webAppToggle.checked = true;
    webAppToggle.disabled = true;
    webAppToggle.addEventListener('click', () => {
      showPopup('Web-App Mode cannot be turned off while in standalone mode.');
    });
  } else {
    webAppToggle.checked = false;
    webAppToggle.disabled = true;
    webAppToggle.addEventListener('click', () => {
      showPopup('Web-App Mode can only be enabled in mobile web app mode.');
    });
  }

  // Cloak Button
  cloakButton?.addEventListener('click', () => {
    if (!webAppToggle.checked) {
      openCloak();
    } else {
      showPopup('This Setting Cannot Be Activated Due To Web-App Mode');
    }
  });

  // Auto Cloak
  if (autoCloakToggle) {
    autoCloakToggle.checked = localStorage.getItem('autoCloak') === 'true';

    autoCloakToggle.addEventListener('change', () => {
      localStorage.setItem('autoCloak', autoCloakToggle.checked);
      if (autoCloakToggle.checked && !webAppToggle.checked) {
        setTimeout(() => openCloak(), 300);
      } else if (webAppToggle.checked) {
        autoCloakToggle.checked = false;
        showPopup('This Setting Cannot Be Activated Due To Web-App Mode');
      }
    });

    // Trigger Auto Cloak on page load if enabled
    if (autoCloakToggle.checked && !webAppToggle.checked) {
      setTimeout(() => openCloak(), 300);
    }
  }

  // Panic Button (placeholder)
  if (panicButtonToggle) {
    panicButtonToggle.checked = localStorage.getItem('panicButton') === 'true';
    panicButtonToggle.addEventListener('change', () => {
      localStorage.setItem('panicButton', panicButtonToggle.checked);
    });
  }
});
