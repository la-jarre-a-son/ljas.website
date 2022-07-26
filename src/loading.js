import {
  DefaultLoadingManager,
} from "three";

const loadingScreen = document.createElement("div", { id: "loading" });
const loadingText = document.createElement("div");
const progressBarContainer = document.createElement("div");
const progressBar = document.createElement("div");
progressBarContainer.appendChild(progressBar);
loadingScreen.append(loadingText, progressBarContainer);

let added = false;
let previousLoaded = 0;
let loadedTotal = 0;
let predictiveTotal = 0;

Object.assign(loadingScreen.style, {
  position: 'absolute',
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  padding: "24px",
  color: "white",
  fontFamily: "sans-serif",
  fontSize: "4vh",
  textAlign: "center",
  pointerEvents: "none",
});

Object.assign(progressBarContainer.style, {
  width: "60vw",
  border: "1px solid currentColor",
  borderRadius: "3px",
  padding: "4px",
  marginTop: "16px",
});

Object.assign(progressBar.style, {
  width: "0%",
  height: "16px",
  background: "currentColor",
  transition: "all 0.3s linear",
});


function show() {
  document.body.appendChild(loadingScreen);
  added = true;
}

function hide() {
  document.body.removeChild(loadingScreen);
  added = false;
}

function goRed() {
  loadingScreen.style.color = 'red';
}

function start(message, total) {
  loadingText.innerText = message;
  predictiveTotal = total;
  show();
}

function end() {
  previousLoaded = loadedTotal;
  hide();
}

function error(message) {
  goRed();
  show();
  loadingText.innerText = message;
}

function text(message) {
  show();
  loadingText.innerText = message;
}


function loadProgress(url, itemsLoaded, itemsTotal) {
  console.log('[LoadingManager]', url, itemsLoaded, itemsTotal)
  loadedTotal = itemsLoaded;

  progressBar.style.width = `${((itemsLoaded - previousLoaded) / Math.max(itemsTotal - previousLoaded, predictiveTotal))*100}%`;
}

DefaultLoadingManager.onStart = loadProgress;
DefaultLoadingManager.onProgress = loadProgress;
DefaultLoadingManager.onError = (url) => error(new Error('Failed to load ' + url));

export { start, text, end, error };