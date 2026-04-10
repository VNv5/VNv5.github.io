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
  const el = document.documentElement;

  if (!document.fullscreenElement) {
    el.requestFullscreen?.();
    document.body.classList.add("embed-fullscreen");
    exitBtn.style.display = "block";
  } else {
    document.exitFullscreen?.();
    document.body.classList.remove("embed-fullscreen");
    exitBtn.style.display = "none";
  }
}

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
