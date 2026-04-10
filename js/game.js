const frame = document.getElementById("gameFrame");
const exitBtn = document.getElementById("exitFullscreenBtn");
const player = document.querySelector(".game-player");

function refreshGame() {
  frame.src = frame.src;
}

function isWebApp() {
  return window.navigator.standalone === true;
}

function isFullscreen() {
  return document.body.classList.contains("embed-fullscreen");
}

function toggleFullscreen() {
  if (isWebApp()) {
    document.body.classList.toggle("embed-fullscreen");
    exitBtn.style.display = isFullscreen() ? "block" : "none";
  } else {
    if (!document.fullscreenElement) {
      player.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
  document.activeElement.blur();
}

// Sync CSS class with browser fullscreen state
document.addEventListener("fullscreenchange", () => {
  if (document.fullscreenElement) {
    player.classList.add("player-fullscreen");
  } else {
    player.classList.remove("player-fullscreen");
  }
});

function exitFullscreenMode() {
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
