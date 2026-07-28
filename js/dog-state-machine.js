/* ==========================================================================
   SmartDog (Namyang Puppy) — Character Finite State Machine (FSM) & Pipeline
   ========================================================================== */

const DOG_STATES = {
  IDLE: 'IDLE',
  IDLE_LOOKING: 'IDLE_LOOKING',
  WALKING: 'WALKING',
  STOPPING: 'STOPPING',
  RUNNING: 'RUNNING',
  CURIOUS: 'CURIOUS',
  EXCITED: 'EXCITED',
  HAPPY: 'HAPPY',
  SITTING: 'SITTING',
  LYING_DOWN: 'LYING_DOWN',
  SLEEPING: 'SLEEPING',
  WAKING_UP: 'WAKING_UP',
  SURPRISED: 'SURPRISED',
  THINKING: 'THINKING',
  WORKING: 'WORKING',
  ATTENTION_SEEKING: 'ATTENTION_SEEKING'
};

class DogStateMachine {
  constructor() {
    this.currentState = DOG_STATES.IDLE;
    this.previousState = DOG_STATES.IDLE;
    this.isTransitioning = false;
    this.stateTimer = null;
  }

  init() {
    this.transitionTo(DOG_STATES.IDLE);
    this.scheduleNextStateChange();
  }

  transitionTo(newState, durationMs = 0) {
    if (this.currentState === newState && newState !== DOG_STATES.WALKING) return;

    this.previousState = this.currentState;
    this.currentState = newState;

    // Synchronize renderer state
    switch (newState) {
      case DOG_STATES.WALKING:
        dogRenderer.setAction('walking');
        break;
      case DOG_STATES.STOPPING:
        dogRenderer.setAction('stopping');
        break;
      case DOG_STATES.RUNNING:
        dogRenderer.setAction('running');
        break;
      case DOG_STATES.CURIOUS:
      case DOG_STATES.IDLE_LOOKING:
        dogRenderer.setAction('curious');
        break;
      case DOG_STATES.EXCITED:
      case DOG_STATES.HAPPY:
        dogRenderer.setAction('happy');
        break;
      case DOG_STATES.SITTING:
        dogRenderer.setAction('sitting');
        break;
      case DOG_STATES.LYING_DOWN:
        dogRenderer.setAction('lying_down');
        break;
      case DOG_STATES.SLEEPING:
        dogRenderer.setAction('sleeping');
        break;
      case DOG_STATES.WAKING_UP:
        dogRenderer.setAction('waking_up');
        break;
      case DOG_STATES.SURPRISED:
        dogRenderer.setAction('surprised');
        break;
      case DOG_STATES.ATTENTION_SEEKING:
        dogRenderer.setAction('bark');
        break;
      default:
        dogRenderer.setAction('idle');
    }

    if (window.renderStageDog) window.renderStageDog();

    if (durationMs > 0) {
      clearTimeout(this.stateTimer);
      this.stateTimer = setTimeout(() => {
        this.gracefulTransitionToIdle();
      }, durationMs);
    }
  }

  // Gracefully transition back to idle without abrupt state cuts
  gracefulTransitionToIdle() {
    if (this.currentState === DOG_STATES.WALKING || this.currentState === DOG_STATES.RUNNING) {
      this.transitionTo(DOG_STATES.STOPPING);
      setTimeout(() => {
        this.transitionTo(DOG_STATES.IDLE);
      }, 400);
    } else if (this.currentState === DOG_STATES.SLEEPING) {
      this.transitionTo(DOG_STATES.WAKING_UP);
      setTimeout(() => {
        this.transitionTo(DOG_STATES.IDLE);
      }, 1200);
    } else {
      this.transitionTo(DOG_STATES.IDLE);
    }
  }

  // Handle activity reaction events with smooth state pipelines
  handleActivityReaction(targetState, durationMs = 3500) {
    if (this.currentState === DOG_STATES.WALKING || this.currentState === DOG_STATES.RUNNING) {
      // Finish active walking step before reacting
      this.transitionTo(DOG_STATES.STOPPING);
      setTimeout(() => {
        this.transitionTo(targetState, durationMs);
      }, 350);
    } else if (this.currentState === DOG_STATES.SLEEPING) {
      this.transitionTo(DOG_STATES.WAKING_UP);
      setTimeout(() => {
        this.transitionTo(targetState, durationMs);
      }, 1000);
    } else {
      this.transitionTo(targetState, durationMs);
    }
  }

  scheduleNextStateChange() {
    const nextRandomBehavior = () => {
      if (this.currentState === DOG_STATES.SLEEPING) {
        if (Math.random() < 0.2) this.gracefulTransitionToIdle();
      } else {
        const energy = window.dogPersonality ? window.dogPersonality.traits.energy : 0.5;
        const roll = Math.random();

        if (roll < 0.35) {
          this.transitionTo(DOG_STATES.IDLE);
        } else if (roll < 0.5) {
          this.transitionTo(DOG_STATES.IDLE_LOOKING);
        } else if (roll < 0.75) {
          const dir = Math.random() > 0.5 ? 'right' : 'left';
          dogRenderer.setDirection(dir);
          if (window.dogMovement) window.dogMovement.direction = dir;
          this.transitionTo(energy > 0.75 ? DOG_STATES.RUNNING : DOG_STATES.WALKING);
        } else if (roll < 0.9) {
          this.transitionTo(DOG_STATES.SITTING);
        } else {
          this.transitionTo(DOG_STATES.LYING_DOWN);
        }
      }

      const nextDelay = Math.floor(4500 + Math.random() * 6500);
      setTimeout(nextRandomBehavior, nextDelay);
    };

    setTimeout(nextRandomBehavior, 5000);
  }
}

// Global Dog FSM instance
const dogFSM = new DogStateMachine();
