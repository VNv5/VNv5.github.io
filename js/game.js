const frame = document.getElementById("gameFrame");
const exitBtn = document.getElementById("exitFullscreenBtn");
const player = document.querySelector(".game-player");

function refreshGame() {
  frame.src = frame.src;
}

function isWebApp() {
  return window.navigator.standalone === true;
}

function toggleFullscreen() {
  const isCustom = document.body.classList.contains("embed-fullscreen");

  // If already in browser fullscreen → exit it
  if (document.fullscreenElement) {
    document.exitFullscreen?.();
    return;
  }

  // If NOT in browser fullscreen, enter it first
  const el = document.documentElement;

  if (el.requestFullscreen) {
    el.requestFullscreen().catch(() => {
      // fallback if blocked → use custom fullscreen
      document.body.classList.toggle("embed-fullscreen");
    });
  } else {
    // fallback for iOS / unsupported browsers
    document.body.classList.toggle("embed-fullscreen");
  }

  exitBtn.style.display = "block";
  document.activeElement.blur();
}

function exitFullscreenMode() {
  if (document.fullscreenElement) {
    document.exitFullscreen?.();
  }

  document.body.classList.remove("embed-fullscreen");
  exitBtn.style.display = "none";
}

function openDeletePopup() {
  document.getElementById("deletePopup").classList.add("show");
}

function closeDeletePopup() {
  document.getElementById("deletePopup").classList.remove("show");
}

function confirmDelete() {
  closeDeletePopup();
  try {
    const win = frame.contentWindow;
    win.localStorage.clear();
    win.sessionStorage.clear();
    win.indexedDB.databases().then(dbs => {
      dbs.forEach(db => win.indexedDB.deleteDatabase(db.name));
    });
  } catch(e) {}
  frame.src = "about:blank";
  setTimeout(() => {
    frame.src = frame.getAttribute("data-src");
  }, 300);
}
