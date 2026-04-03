/* ===== PANIC BUTTON ===== */
#panic-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;

  width: 65px;
  height: 65px;
  border-radius: 50%;

  background-color: #e65c00;
  background-image: url("/images/panicbutton.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 65%;

  z-index: 9999;
  display: none;

  cursor: grab;
  user-select: none;

  transition: transform 0.2s ease, opacity 0.2s ease;

  box-shadow: 0 0 12px #e65c00, 0 0 25px rgba(230,92,0,0.6);
}

#panic-btn:active {
  transform: scale(1.1);
  cursor: grabbing;
}

#panic-btn:hover {
  box-shadow: 0 0 20px #fff, 0 0 40px #e65c00;
}

/* Sizes */
.panic-small { width: 45px; height: 45px; }
.panic-medium { width: 65px; height: 65px; }
.panic-large { width: 85px; height: 85px; }

/* ===== MENU ===== */
#panic-menu {
  position: fixed;
  width: 260px;
  max-width: 80vw;

  background: rgba(17,17,17,0.95);
  border-radius: 18px;
  padding: 18px;

  display: none;
  flex-direction: column;
  gap: 15px;

  z-index: 10000;

  box-shadow: 0 0 25px #e65c00, 0 0 50px rgba(230,92,0,0.6);

  animation: panicPop 0.2s ease;
}

@keyframes panicPop {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}

/* Sections */
.panic-section {
  font-size: 0.9rem;
  color: #aaa;
}

/* Size buttons */
.panic-options {
  display: flex;
  gap: 8px;
}

.panic-options button {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 10px;
  background: #222;
  color: #fff;
  cursor: pointer;
  transition: 0.2s;
}

.panic-options button.active {
  background: #e65c00;
  box-shadow: 0 0 10px #e65c00;
}

/* Slider */
#panic-opacity {
  width: 100%;
}

/* Mode list */
.panic-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 120px;
  overflow-y: auto;
}

.panic-item {
  padding: 10px;
  border-radius: 10px;
  background: #1a1a1a;
  cursor: pointer;
  transition: 0.2s;
}

.panic-item:hover {
  background: rgba(230,92,0,0.2);
}

.panic-item.active {
  background: #e65c00;
  box-shadow: 0 0 10px #e65c00;
}
