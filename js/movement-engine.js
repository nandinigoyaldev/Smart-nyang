/* ==========================================================================
   SmartDog (Namyang Puppy) — Smooth Natural Desktop Movement Engine
   ========================================================================== */

class DogMovementEngine {
  constructor() {
    this.direction = 'right';   // 'right', 'left'
    this.walkStep = 0;
    this.currentSpeed = 0;
    this.targetSpeed = 3;
    
    // Bounds cache
    this.screenWidth = window.innerWidth || 1440;
    this.screenHeight = window.innerHeight || 900;

    this.isMoving = false;
  }

  init() {
    this.startMovementLoop();
  }

  startMovementLoop() {
    setInterval(() => {
      if (!window.dogFSM) return;
      const state = window.dogFSM.currentState;

      if (state === DOG_STATES.WALKING || state === DOG_STATES.RUNNING) {
        this.isMoving = true;
        this.targetSpeed = state === DOG_STATES.RUNNING ? 5 : 3;

        // Smooth acceleration curve
        this.currentSpeed += (this.targetSpeed - this.currentSpeed) * 0.2;

        this.walkStep = (this.walkStep + 1) % 4;
        dogRenderer.setWalkFrame(this.walkStep);
        dogRenderer.setDirection(this.direction);
        
        // Dispatch position step to Electron
        if (window.electronAPI && window.electronAPI.moveWindow) {
          const deltaX = (this.direction === 'right' ? 1 : -1) * Math.round(this.currentSpeed);
          window.electronAPI.moveWindow(deltaX, 0);
        }

        if (window.renderStageDog) window.renderStageDog();
      } else {
        if (this.isMoving) {
          // Decelerate to stop smoothly
          this.currentSpeed *= 0.5;
          if (this.currentSpeed < 0.2) {
            this.currentSpeed = 0;
            this.isMoving = false;
          }
        }
      }
    }, 120);
  }

  triggerHappy() {
    if (window.dogFSM) window.dogFSM.transitionTo(DOG_STATES.EXCITED, 3000);
    if (window.dogAudio) window.dogAudio.playBark(1.2);
  }

  triggerBark() {
    if (window.dogFSM) window.dogFSM.transitionTo(DOG_STATES.ATTENTION_SEEKING, 2000);
    if (window.dogAudio) window.dogAudio.playBark(1.0);
  }
}

// Global Movement Engine instance
const dogMovement = new DogMovementEngine();
