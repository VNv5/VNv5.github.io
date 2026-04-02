// main.js

// 🔹 Load the utility bar / nav
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

// 🔹 Smooth page transitions
function setupTransitions() {
  document.querySelectorAll("a").forEach(link => {
    if (link.hostname === window.location.hostname) {
      link.addEventListener("click", function(e) {
        if (this.closest('.utility-bar')) return; // don't transition utility bar links
        const target = this.href;
        const current = window.location.href;
        if (target === current || this.getAttribute("href") === "#") return;

        e.preventDefault();
        document.body.classList.remove("fade-in");
        document.body.classList.add("fade-out");

        setTimeout(() => {
          window.location.href = target;
        }, 500); // matches CSS transition
      });
    }
  });
}

// 🔹 Detect if running as mobile web app
function detectWebAppMode() {
  return window.matchMedia('(display-mode: standalone)').matches
       || window.navigator.standalone === true;
}

// 🔹 Show popup
function showPopup(msg) {
  const popup = document.getElementById('settings-popup');
  const popupMessage = document.getElementById('popup-message');
  popupMessage.textContent = msg;
  popup.classList.add('show');
}

// 🔹 Cloak functionality
function openCloak() {
  document.body.classList.remove("fade-in");
  document.body.classList.add("fade-out");

  setTimeout(() => {
    const newTab = window.open('about:blank', '_blank');
    if (newTab) {
      newTab.document.write('<!DOCTYPE html>' + document.documentElement.outerHTML);
      newTab.document.close();
      window.location.href = 'https://www.google.com';
    } else {
      showPopup('Popup blocked! Please allow popups to use Cloak.');
    }
  }, 300); // give fade-out time to play
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

  // 🔹 Web-App Mode
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

  // 🔹 Cloak button
  cloakButton?.addEventListener('click', () => {
    if (!webAppToggle.checked) {
      openCloak();
    } else {
      showPopup('This Setting Cannot Be Activated Due To Web-App Mode');
    }
  });

  // 🔹 Auto Cloak
  if (autoCloakToggle) {
    autoCloakToggle.checked = localStorage.getItem('autoCloak') === 'true';

    autoCloakToggle.addEventListener('change', () => {
      localStorage.setItem('autoCloak', autoCloakToggle.checked);
      if (autoCloakToggle.checked && !webAppToggle.checked) {
        openCloak();
      } else if (webAppToggle.checked) {
        autoCloakToggle.checked = false;
        showPopup('This Setting Cannot Be Activated Due To Web-App Mode');
      }
    });

    // 🔹 Trigger on page load if enabled
    if (autoCloakToggle.checked && !webAppToggle.checked) {
      openCloak();
    }
  }

  // 🔹 Panic button (save state, functionality later)
  if (panicButtonToggle) {
    panicButtonToggle.checked = localStorage.getItem('panicButton') === 'true';
    panicButtonToggle.addEventListener('change', () => {
      localStorage.setItem('panicButton', panicButtonToggle.checked);
    });
  }
});
