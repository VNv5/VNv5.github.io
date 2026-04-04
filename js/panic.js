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

function applySettings() {
  const enabled = localStorage.getItem("panicEnabled") === "true";
  const size = localStorage.getItem("panicSize") || "medium";
  const opacity = localStorage.getItem("panicOpacity") || 100;
  const locked = localStorage.getItem("panicLocked") === "true";
  const action = localStorage.getItem("panicAction") || "classroom";
  const savedX = localStorage.getItem("panicX");
  const savedY = localStorage.getItem("panicY");

  btn.style.display = enabled ? "flex" : "none";

  btn.className = "";
  btn.id = "panic-btn";
  btn.classList.add(`panic-${size}`);

  const dim = SIZE_MAP[size];
  btn.style.width = dim + "px";
  btn.style.height = dim + "px";

  btn.style.opacity = opacity / 100;

  if (savedX && savedY) {
    btn.style.left = savedX + "px";
    btn.style.top = savedY + "px";
    btn.style.right = "auto";
    btn.style.bottom = "auto";
  }

  document.querySelectorAll("[data-size]").forEach(b =>
    b.classList.toggle("active", b.dataset.size === size)
  );

  document.querySelectorAll("[data-action]").forEach(b =>
    b.classList.toggle("active", b.dataset.action === action)
  );

  document.getElementById("lock-state").textContent = locked ? "ON" : "OFF";

  const opacityEl = document.getElementById("panic-opacity");
  if (opacityEl) {
    opacityEl.value = opacity;
    opacityEl.style.setProperty("--val", opacity);
  }
}

/* ===== SIZE FIXED ===== */
document.addEventListener("click", (e) => {
  if (!e.target.dataset.size) return;

  const newSize = e.target.dataset.size;
  const rect = btn.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const newDim = SIZE_MAP[newSize]; // ✅ FIXED ORDER

  localStorage.setItem("panicSize", newSize);

  btn.className = "";
  btn.id = "panic-btn";
  btn.classList.add(`panic-${newSize}`);

  btn.style.width = newDim + "px";
  btn.style.height = newDim + "px";

  const newLeft = centerX - newDim / 2;
  const newTop = centerY - newDim / 2;

  btn.style.left = newLeft + "px";
  btn.style.top = newTop + "px";

  localStorage.setItem("panicX", newLeft);
  localStorage.setItem("panicY", newTop);

  document.querySelectorAll("[data-size]").forEach(b =>
    b.classList.toggle("active", b.dataset.size === newSize)
  );
});

/* ===== ACTION ===== */
document.addEventListener("click", (e) => {
  if (!e.target.dataset.action) return;
  const action = e.target.dataset.action;
  localStorage.setItem("panicAction", action);
});

/* ===== OPACITY ===== */
document.addEventListener("input", (e) => {
  if (e.target.id === "panic-opacity") {
    localStorage.setItem("panicOpacity", e.target.value);
    btn.style.opacity = e.target.value / 100;
    e.target.style.setProperty("--val", e.target.value);
  }
});

/* ===== LOCK ===== */
document.getElementById("panic-lock").onclick = () => {
  const locked = localStorage.getItem("panicLocked") === "true";
  localStorage.setItem("panicLocked", String(!locked));
  applySettings();
};

/* ===== DRAG ===== */
let dragging = false, moved = false, offsetX = 0, offsetY = 0;

btn.addEventListener("mousedown", startDrag);
btn.addEventListener("touchstart", startDrag, { passive: false });

function startDrag(e) {
  if (localStorage.getItem("panicLocked") === "true") return;

  dragging = true;
  moved = false;

  const rect = btn.getBoundingClientRect();
  const x = e.touches ? e.touches[0].clientX : e.clientX;
  const y = e.touches ? e.touches[0].clientY : e.clientY;

  offsetX = x - rect.left;
  offsetY = y - rect.top;

  e.preventDefault();
}

document.addEventListener("mousemove", drag);
document.addEventListener("touchmove", drag, { passive: false });

function drag(e) {
  if (!dragging) return;

  const x = e.touches ? e.touches[0].clientX : e.clientX;
  const y = e.touches ? e.touches[0].clientY : e.clientY;

  const left = x - offsetX;
  const top = y - offsetY;

  if (Math.abs(left - (parseFloat(btn.style.left) || 0)) > 5) moved = true;

  btn.style.left = left + "px";
  btn.style.top = top + "px";

  e.preventDefault();
}

document.addEventListener("mouseup", stopDrag);
document.addEventListener("touchend", stopDrag);

function stopDrag() {
  if (dragging && moved) {
    localStorage.setItem("panicX", parseFloat(btn.style.left));
    localStorage.setItem("panicY", parseFloat(btn.style.top));
  }
  dragging = false;
}

/* ===== CLICK ===== */
btn.addEventListener("click", () => {
  if (moved) { moved = false; return; }
  const action = localStorage.getItem("panicAction") || "classroom";
  window.location.href = ACTION_MAP[action];
});

/* ===== INIT ===== */
applySettings();
