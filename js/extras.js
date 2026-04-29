function openPanel(type) {
  const overlay = document.getElementById("extras-panel");
  const title = document.getElementById("panel-title");
  const body = document.getElementById("panel-body");

  overlay.classList.add("show");
  body.innerHTML = "";

  /* ===== CLOAK ===== */
  if (type === "cloak") {
    title.textContent = "App Cloaking";

    body.innerHTML = `
      <p>Select an app style. Re-add to home screen after saving.</p>

      <button class="panel-btn" onclick="setCloak('classroom')">Google Classroom</button>
      <button class="panel-btn" onclick="setCloak('docs')">Google Docs</button>
      <button class="panel-btn" onclick="setCloak('slides')">Google Slides</button>
      <button class="panel-btn" onclick="setCloak('drive')">Google Drive</button>
    `;
  }

  /* ===== LINKS ===== */
  if (type === "links") {
    title.textContent = "Links";

    body.innerHTML = `
      <button class="panel-btn" onclick="window.open('https://google.com')">Google</button>
      <button class="panel-btn">Add more links later</button>
    `;
  }

  /* ===== CHANGELOG ===== */
  if (type === "changelog") {
    title.textContent = "Changelog";

    body.innerHTML = `
      <p>v1.0 - Initial release</p>
      <p>v1.1 - Cloaking added</p>
      <p>v1.2 - Extras system created</p>
    `;
  }

  /* ===== CODE PANEL ===== */
  if (type === "code") {
    title.textContent = "Code Panel";

    body.innerHTML = `
      <input class="panel-input" id="codeInput" placeholder="Enter code...">
      <button class="panel-btn" onclick="submitCode()">Submit</button>
    `;
  }
}

function closePanel() {
  document.getElementById("extras-panel").classList.remove("show");
}

/* ===== CLOAK SAVE ===== */
function setCloak(type) {
  let name = "The Carey Network";
  let icon = "/images/icon.png";

  if (type === "classroom") {
    name = "Google Classroom";
    icon = "/images/classroom.png";
  }

  if (type === "docs") {
    name = "Google Docs";
    icon = "/images/docs.png";
  }

  if (type === "slides") {
    name = "Google Slides";
    icon = "/images/slides.png";
  }

  if (type === "drive") {
    name = "Google Drive";
    icon = "/images/drive.png";
  }

  localStorage.setItem("appName", name);
  localStorage.setItem("appIcon", icon);

  alert("Saved! Re-add to home screen.");
}

/* ===== CODE ===== */
function submitCode() {
  const val = document.getElementById("codeInput").value;
  alert("Code: " + val);
}
