/* ==========================================================================
   SmartDog (Namyang Puppy) — Living Desktop Dog Companion Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initDogApp();
});

function initDogApp() {
  renderStageDog();
  
  if (window.dogFSM) dogFSM.init();
  if (window.dogMovement) dogMovement.init();
  if (window.dogActivity) dogActivity.init();

  initDogInteractions();
  initMovementToggleListener();

  // Welcome greeting speech bubble
  setTimeout(() => {
    showDogSpeech("Woof! I'm living on your desktop! 🐾", 4500);
    if (window.dogAudio) dogAudio.playBark(1.2);
  }, 600);
}

function renderStageDog() {
  const container = document.getElementById('dog-svg-container');
  if (container) {
    container.innerHTML = dogRenderer.generateSVG(160, 160);
  }
}
window.renderStageDog = renderStageDog;

function showDogSpeech(text, durationMs = 4000) {
  const bubble = document.getElementById('speech-bubble');
  const bubbleText = document.getElementById('bubble-text');
  
  if (bubble && bubbleText) {
    bubbleText.textContent = text;
    bubble.style.display = 'flex';

    if (durationMs > 0) {
      clearTimeout(window.speechTimeout);
      window.speechTimeout = setTimeout(() => {
        bubble.style.display = 'none';
      }, durationMs);
    }
  }
}
window.showDogSpeech = showDogSpeech;

function initDogInteractions() {
  const dogWrapper = document.getElementById('dog-wrapper');
  if (!dogWrapper) return;

  // Primary Click: Trigger happy reaction & bark
  dogWrapper.addEventListener('click', (e) => {
    if (e.button !== 0) return; // Only primary left click
    if (window.dogPersonality) dogPersonality.onUserInteraction();
    if (window.dogAudio) dogAudio.playBark(1.3);
    if (window.dogFSM) dogFSM.transitionTo(DOG_STATES.EXCITED, 3500);
    
    const clickQuotes = [
      "Woof! Need a break? 🐾",
      "I'm keeping you company! 🐶",
      "Tail wagging mode activated! 💖",
      "You've got this! Keep going! 🚀"
    ];
    const quote = clickQuotes[Math.floor(Math.random() * clickQuotes.length)];
    showDogSpeech(quote, 4000);
  });

  // Secondary Right Click: Trigger native dog context menu
  dogWrapper.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (window.electronAPI && window.electronAPI.openContextMenu) {
      window.electronAPI.openContextMenu();
    }
  });
}

function initMovementToggleListener() {
  if (window.electronAPI && window.electronAPI.onToggleMovement) {
    window.electronAPI.onToggleMovement((enabled) => {
      if (window.dogMovement) {
        if (!enabled) {
          window.dogMovement.isMoving = false;
          if (window.dogFSM) window.dogFSM.transitionTo(DOG_STATES.SITTING);
          showDogSpeech("Movement paused ⏸️", 2500);
        } else {
          if (window.dogFSM) window.dogFSM.transitionTo(DOG_STATES.IDLE);
          showDogSpeech("Movement resumed ▶️", 2500);
        }
      }
    });
  }
}
