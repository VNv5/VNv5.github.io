const btn = document.createElement("div");
btn.id = "panic-btn";

const menu = document.createElement("div");
menu.id = "panic-menu";

menu.innerHTML = `
<div>
  <div class="panic-section">Action</div>
  <div class="panic-options">
    <button data-action="classroom">Class</button>
    <button data-action="slides">Slides</button>
    <button data-action="docs">Docs</button>
  </div>
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
  <div class="panic-slider-wrap">
    <input type="range" id="panic-opacity" min="5" max="100">
  </div>
</div>

<div class="panic-lock" id="panic-lock">
  <span>Lock Position</span>
  <span id="lock-state">OFF</span>
</div>
`;

document.body.appendChild(btn);
document.body.appendChild(menu);

const SIZE_MAP = { small: 45, medium: 65, large: 90 };

const ACTION_MAP = {
  classroom: "https://classroom.google.com",
  slides: "https://docs.google.com/presentation",
  docs: "https://docs.google.com/document"
};

// force visible
if (localStorage.getItem("panicEnabled") === null) {
  localStorage.setItem("panicEnabled", "true");
}

function applySettings() {
  const enabled = localStorage.getItem("panicEnabled") === "true";
  const size = localStorage.getItem("panicSize") || "medium";
  const opacity = localStorage.getItem("panicOpacity") || 100;
  const action = localStorage.getItem("panicAction") || "classroom";

  btn.style.display = enabled ? "flex" : "none";

  const dim = SIZE_MAP[size];
  btn.style.width = dim + "px";
  btn.style.height = dim + "px";

  btn.style.opacity = opacity / 100;

  document.querySelectorAll("[data-size]").forEach(b => {
    b.classList.toggle("active", b.dataset.size === size);
  });

  document.querySelectorAll("[data-action]").forEach(b => {
    b.classList.toggle("active", b.dataset.action === action);
  });

  const slider = document.getElementById("panic-opacity");
  if (slider) slider.value = opacity;
}

/* ===== SIZE FIX (THIS WAS YOUR BUG) ===== */
document.addEventListener("click", (e) => {
  if (!e.target.dataset.size) return;

  const newSize = e.target.dataset.size;
  const newDim = SIZE_MAP[newSize]; // FIX: define before use

  localStorage.setItem("panicSize", newSize);

  btn.style.width = newDim + "px";
  btn.style.height = newDim + "px";

  applySettings();
});

/* ===== ACTION ===== */
document.addEventListener("click", (e) => {
  if (!e.target.dataset.action) return;

  localStorage.setItem("panicAction", e.target.dataset.action);
  applySettings();
});

/* ===== OPACITY ===== */
document.addEventListener("input", (e) => {
  if (e.target.id === "panic-opacity") {
    btn.style.opacity = e.target.value / 100;
    localStorage.setItem("panicOpacity", e.target.value);
  }
});

/* ===== DRAG (CLEANED, NOT REWRITTEN) ===== */
let dragging = false;
let offsetX = 0;
let offsetY = 0;

btn.addEventListener("pointerdown", (e) => {
  dragging = true;

  const rect = btn.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;

  btn.setPointerCapture(e.pointerId);
});

btn.addEventListener("pointermove", (e) => {
  if (!dragging) return;

  btn.style.left = (e.clientX - offsetX) + "px";
  btn.style.top = (e.clientY - offsetY) + "px";
  btn.style.right = "auto";
  btn.style.bottom = "auto";
});

btn.addEventListener("pointerup", () => {
  dragging = false;
});

/* ===== HOLD MENU ===== */
let holdTimer = null;

btn.addEventListener("pointerdown", () => {
  holdTimer = setTimeout(() => {
    menu.style.display = "flex";
  }, 600);
});

btn.addEventListener("pointerup", () => {
  clearTimeout(holdTimer);
});

/* ===== CLOSE MENU ===== */
document.addEventListener("click", (e) => {
  if (!menu.contains(e.target) && e.target !== btn) {
    menu.style.display = "none";
  }
});

/* ===== CLICK ===== */
btn.addEventListener("click", () => {
  const action = localStorage.getItem("panicAction") || "classroom";
  window.location.href = ACTION_MAP[action];
});

applySettings();
