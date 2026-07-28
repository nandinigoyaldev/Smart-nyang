/* ==========================================================================
   SmartNyang — Web Audio API Synthesizer (Cat Audio Engine)
   ========================================================================== */

class CatAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // Synthesize a cute retro pixel cat meow sound
  playMeow(pitchMultiplier = 1.0) {
    if (!this.enabled) return;
    this.init();
    
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';

    // Meow frequency pitch contour (rise then soft fall)
    const baseFreq = 520 * pitchMultiplier;
    osc.frequency.setValueAtTime(baseFreq * 0.8, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.35);

    // Gain envelope (soft attack, decay)
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  }

  // Synthesize low soothing purr vibration
  playPurr() {
    if (!this.enabled) return;
    this.init();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(45, now);
    
    // Vibrato LFO for purr effect
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(16, now); // 16 Hz purr flutter
    lfoGain.gain.setValueAtTime(10, now);

    lfo.connect(osc.frequency);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.8);

    lfo.start(now);
    osc.start(now);

    lfo.stop(now + 0.8);
    osc.stop(now + 0.8);

    lfo.connect(gain);
    gain.connect(this.ctx.destination);
  }

  // Synthesize subtle mechanical keyboard typing click for cat kneading animation
  playKeyClick() {
    if (!this.enabled) return;
    this.init();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, now);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  // Synthesize gentle chime bell for Pomodoro / Break alerts
  playChime() {
    if (!this.enabled) return;
    this.init();

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0.01, now + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.6);
    });
  }
}

// Global audio singleton instance
const catAudio = new CatAudioEngine();
