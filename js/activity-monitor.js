/* ==========================================================================
   SmartDog (Namyang Puppy) — Activity & Contextual Reaction Engine
   ========================================================================== */

class DogActivityMonitor {
  constructor() {
    this.activeTimeSeconds = 0;
    this.idleTimeSeconds = 0;
    this.isUserIdle = false;
    this.lastActivityTimestamp = Date.now();
    this.currentContextCategory = 'general';
    
    // Cooldown management to avoid speech bubble spamming
    this.lastPromptTime = 0;
    this.promptCooldownMs = 30 * 1000;
  }

  init() {
    this.bindActivityListeners();
    this.bindElectronAppContext();
    this.startTrackingLoop();
  }

  bindActivityListeners() {
    let activityDebounceTimer = null;
    const onUserActive = () => {
      const now = Date.now();
      const wasIdle = this.isUserIdle;
      
      this.isUserIdle = false;
      this.idleTimeSeconds = 0;
      this.lastActivityTimestamp = now;

      // React if user returned from idle pause
      if (wasIdle) {
        this.triggerPrompt("You're back! 🎉", DOG_STATES.EXCITED);
      }

      // Debounced subtle reaction when user starts typing / active work
      clearTimeout(activityDebounceTimer);
      activityDebounceTimer = setTimeout(() => {
        if (window.dogFSM && window.dogFSM.currentState === DOG_STATES.IDLE) {
          if (Math.random() < 0.25) {
            window.dogFSM.handleActivityReaction(DOG_STATES.CURIOUS, 2500);
          }
        }
      }, 600);
    };

    window.addEventListener('mousemove', onUserActive, { passive: true });
    window.addEventListener('keydown', onUserActive, { passive: true });
    window.addEventListener('click', onUserActive, { passive: true });
  }

  bindElectronAppContext() {
    if (window.electronAPI && window.electronAPI.onAppContextChanged) {
      window.electronAPI.onAppContextChanged((appName) => {
        this.handleApplicationContextChange(appName);
      });
    }
  }

  handleApplicationContextChange(appName) {
    const lower = appName.toLowerCase();

    // 1. Coding / IDE Applications
    if (lower.includes('code') || lower.includes('xcode') || lower.includes('terminal') || lower.includes('sublime') || lower.includes('idea') || lower.includes('webstorm')) {
      this.currentContextCategory = 'coding';
      if (window.dogFSM) window.dogFSM.handleActivityReaction(DOG_STATES.WORKING, 4000);
      
      const codingQuotes = [
        "Okay, time to cook 💻",
        "Let's write clean code today! 🐾",
        "Coding mode activated! 🚀"
      ];
      this.triggerPrompt(codingQuotes[Math.floor(Math.random() * codingQuotes.length)], DOG_STATES.WORKING);

    // 2. Music Applications
    } else if (lower.includes('spotify') || lower.includes('music') || lower.includes('apple music')) {
      this.currentContextCategory = 'music';
      if (window.dogFSM) window.dogFSM.handleActivityReaction(DOG_STATES.EXCITED, 3500);
      this.triggerPrompt("Vibing to the beats! 🎵", DOG_STATES.EXCITED);

    // 3. Web Browsers
    } else if (lower.includes('chrome') || lower.includes('safari') || lower.includes('firefox') || lower.includes('edge') || lower.includes('brave')) {
      this.currentContextCategory = 'browsing';
      if (window.dogFSM) window.dogFSM.handleActivityReaction(DOG_STATES.CURIOUS, 3000);
      
    // 4. Communication Apps
    } else if (lower.includes('slack') || lower.includes('discord') || lower.includes('teams') || lower.includes('telegram')) {
      if (window.dogFSM) window.dogFSM.handleActivityReaction(DOG_STATES.SURPRISED, 2500);
      this.triggerPrompt("Who's chatting? 💬", DOG_STATES.SURPRISED);
    }
  }

  startTrackingLoop() {
    setInterval(() => {
      const now = Date.now();
      const elapsedSinceActivity = (now - this.lastActivityTimestamp) / 1000;

      if (elapsedSinceActivity > 90) {
        this.isUserIdle = true;
        this.idleTimeSeconds = Math.floor(elapsedSinceActivity);
      } else {
        this.activeTimeSeconds += 1;
      }

      this.evaluatePeriodicPrompts();
    }, 1000);
  }

  evaluatePeriodicPrompts() {
    const now = Date.now();
    if (now - this.lastPromptTime < this.promptCooldownMs) return;

    // Prolonged continuous coding burst (>30 mins)
    if (this.activeTimeSeconds === 30 * 60 && this.currentContextCategory === 'coding') {
      this.triggerPrompt("Bro, you've been coding for hours 💻", DOG_STATES.CURIOUS);
      return;
    }

    // Prolonged total work burst (>45 mins)
    if (this.activeTimeSeconds === 45 * 60) {
      this.triggerPrompt("Bro... take a quick stretch break! 💧", DOG_STATES.ATTENTION_SEEKING);
      return;
    }

    // Prolonged user inactivity (>3 mins)
    if (this.idleTimeSeconds === 180) {
      this.triggerPrompt("Where did you go? 🐶", DOG_STATES.RESTING);
      return;
    }
  }

  triggerPrompt(text, animState = DOG_STATES.IDLE) {
    this.lastPromptTime = Date.now();

    if (window.showDogSpeech) {
      window.showDogSpeech(text, 4500);
    }

    if (window.dogFSM && animState !== DOG_STATES.IDLE) {
      window.dogFSM.handleActivityReaction(animState, 4000);
    }
  }
}

// Global Activity Monitor instance
const dogActivity = new DogActivityMonitor();
