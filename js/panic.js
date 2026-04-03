// ===== CREATE ELEMENTS =====
const btn = document.createElement("div");
btn.id = "panic-btn";

const img = document.createElement("img");
img.src = "/images/panicbutton.png";
btn.appendChild(img);

const menu = document.createElement("div");
menu.id = "panic-menu";

menu.innerHTML = `
<div id="panic-menu-header">
  <span>Panic Settings</span>
  <button id="panic-close">X</button>
</div>

<div>
  <div class="panic-section">Size</div>
  <div class="panic-options">
    <button data-size="small">S</button>
    <button data-size="medium">M</button>
    <button data-size="large">L</button>
  </div>
</div>

<div>
  <div class="panic-section">Transparency</div>
  <input type="range" id="panic-opacity" min="5" max="100">
</div>

<div class="panic-lock" id="panic-lock">
  <span>Lock Position</span>
  <span id="lock-state">OFF</span>
</div>
`;

document.body.appendChild(btn);
document.body.appendChild(menu);

// ===== SETTINGS =====
function applySettings() {
  const enabled = localStorage.getItem("panicEnabled") === "true";
  const size = localStorage.getItem("panicSize") || "medium";
  const opacity = localStorage.getItem("panicOpacity") || 100;
  const locked = localStorage.getItem("panicLocked") === "true";

  btn.style.display = enabled ? "flex" : "none";
  btn.className = `panic-${size}`;
  btn.style.opacity = opacity / 100;

  document.getElementById("panic-opacity").value = opacity;
  document.getElementById("lock-state").textContent = locked ? "ON" : "OFF";

  document.querySelectorAll("[data-size]").forEach(b => {
    b.classList.toggle("active", b.dataset.size === size);
  });
}

// ===== MENU INTERACTIONS =====
document.addEventListener("click", (e) => {
  if (e.target.dataset.size) {
    localStorage.setItem("panicSize", e.target.dataset.size);
    applySettings();
  }
});

document.addEventListener("input", (e) => {
  if (e.target.id === "panic-opacity") {
    localStorage.setItem("panicOpacity", e.target.value);
    btn.style.opacity = e.target.value / 100;
  }
});

document.getElementById("panic-lock").onclick = () => {
  const locked = localStorage.getItem("panicLocked") === "true";
  localStorage.setItem("panicLocked", !locked);
  applySettings();
};

document.getElementById("panic-close").onclick = () => menu.style.display = "none";

// ===== DRAG + HOLD LOGIC =====
let isDragging = false;
let startX = 0, startY = 0;
let offsetX = 0, offsetY = 0;
let moved = false;
let holdTimer = null;
let holdActivated = false;

function startInteraction(e) {
  const locked = localStorage.getItem("panicLocked") === "true";
  if (locked) return;

  moved = false;
  holdActivated = false;

  const rect = btn.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  startX = clientX;
  startY = clientY;
  offsetX = clientX - rect.left;
  offsetY = clientY - rect.top;

  holdTimer = setTimeout(() => {
    if (!moved) {
      openMenu();
      holdActivated = true;
    }
  }, 700);

  e.preventDefault();
}

function moveInteraction(e) {
  if (!startX) return;

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  const dx = Math.abs(clientX - startX);
  const dy = Math.abs(clientY - startY);

  if (dx > 5 || dy > 5) {
    isDragging = true;
    moved = true;
    clearTimeout(holdTimer);
    holdTimer = null;
  }

  if (!isDragging) return;

  const x = clientX - offsetX;
  const y = clientY - offsetY;

  btn.style.left = x + "px";
  btn.style.top = y + "px";
  btn.style.right = "auto";
  btn.style.bottom = "auto";

  e.preventDefault();
}

function endInteraction() {
  clearTimeout(holdTimer);
  holdTimer = null;
  isDragging = false;
  startX = 0;
  startY = 0;
}

// ===== OPEN MENU =====
function openMenu() {
  menu.style.display = "flex";

  const rect = btn.getBoundingClientRect();
  let x = rect.left;
  let y = rect.top - menu.offsetHeight - 10;

  if (x + menu.offsetWidth > window.innerWidth) x = window.innerWidth - menu.offsetWidth - 10;
  if (y < 0) y = rect.bottom + 10;

  menu.style.left = x + "px";
  menu.style.top = y + "px";
}

// ===== PANIC CLICK =====
btn.addEventListener("click", (e) => {
  if (moved || holdActivated) return;
  window.location.href = "about:blank";
});

// ===== EVENTS =====
btn.addEventListener("mousedown", startInteraction);
btn.addEventListener("touchstart", startInteraction, { passive: false });

document.addEventListener("mousemove", moveInteraction);
document.addEventListener("touchmove", moveInteraction, { passive: false });

document.addEventListener("mouseup", endInteraction);
document.addEventListener("touchend", endInteraction);

// ===== INIT =====
applySettings();
