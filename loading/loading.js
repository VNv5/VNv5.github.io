const loader = document.createElement("div");
loader.id = "loading-screen";

loader.innerHTML = `
  <div class="loader-content">
    <div class="logo">Carey Network</div>
    <div class="spinner"></div>
    <div class="loading-text">Loading...</div>
  </div>
`;

document.documentElement.appendChild(loader);

window.addEventListener("load", () => {
  const time = window.LOADER_TIME ?? 500; // default 0.5s

  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.transition = "opacity 0.5s ease";

    setTimeout(() => {
      loader.remove();
    }, 500);

  }, time);
});
