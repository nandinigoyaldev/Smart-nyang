/* ==========================================================================
   SmartDog (Namyang Puppy) — Personality & Companion Simulation Engine
   ========================================================================== */

class DogPersonalitySystem {
  constructor() {
    this.traits = {
      curiosity: 0.8,   // High curiosity = reacts to active app changes
      energy: 0.7,      // High energy = walks and runs more
      sleepiness: 0.2,  // Increases during idle periods
      happiness: 0.85,  // High happiness = tail wags and cheerful bubbles
      boredom: 0.1
    };

    this.startPersonalityPulse();
  }

  startPersonalityPulse() {
    // Dynamic personality pulse every 30s
    setInterval(() => {
      const currentHour = new Date().getHours();
      
      // Late night hours (11 PM - 6 AM) increase sleepiness
      if (currentHour >= 23 || currentHour < 6) {
        this.traits.sleepiness = Math.min(1.0, this.traits.sleepiness + 0.15);
        this.traits.energy = Math.max(0.2, this.traits.energy - 0.1);
      } else {
        this.traits.sleepiness = Math.max(0.1, this.traits.sleepiness - 0.05);
      }

      // If sleepiness is high, trigger sleep
      if (this.traits.sleepiness > 0.8 && window.dogFSM) {
        window.dogFSM.transitionTo(DOG_STATES.SLEEPING, 15000);
      }
    }, 30000);
  }

  onUserInteraction() {
    this.traits.happiness = Math.min(1.0, this.traits.happiness + 0.1);
    this.traits.boredom = Math.max(0.0, this.traits.boredom - 0.2);
    this.traits.sleepiness = Math.max(0.1, this.traits.sleepiness - 0.1);
  }
}

// Global Personality instance
const dogPersonality = new DogPersonalitySystem();
