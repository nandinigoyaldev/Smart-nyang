/* ==========================================================================
   SmartDog (Namyang Puppy) — Organic Layered SVG Dog Renderer & Animation Engine
   ========================================================================== */

class DogRenderer {
  constructor() {
    this.config = {
      furColor: '#f39c12',      // Warm Golden / Shiba Orange
      bellyColor: '#ffffff',
      earColor: '#d35400',
      eyeColor: '#2c3e50',
      collarColor: '#e74c3c',
      outlineColor: '#000000'
    };

    this.state = {
      action: 'idle', // 'idle', 'idle_looking', 'walking', 'stopping', 'sitting', 'lying_down', 'sleeping', 'waking_up', 'happy', 'excited', 'curious', 'surprised', 'thinking', 'bark'
      direction: 'right', // 'right', 'left'
      walkFrame: 0,
      eyeX: 0,
      eyeY: 0,
      
      // Organic layered motion properties
      breathingPhase: 0,
      isBlinking: false,
      earTwitchLeft: 0,
      earTwitchRight: 0,
      headTilt: 0,
      tailWagAngle: 0,
      zzzFrame: 0,
      stretchPhase: 0
    };

    this.startOrganicLoops();
  }

  setConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  setAction(actionName) {
    this.state.action = actionName;
  }

  setDirection(dir) {
    this.state.direction = dir;
  }

  setWalkFrame(frame) {
    this.state.walkFrame = frame % 4;
  }

  setEyeOffset(dx, dy) {
    this.state.eyeX = Math.max(-3, Math.min(3, dx));
    this.state.eyeY = Math.max(-3, Math.min(3, dy));
  }

  startOrganicLoops() {
    // 1. Organic Breathing Loop (Continuous subtle sine wave chest bobbing)
    setInterval(() => {
      this.state.breathingPhase = (this.state.breathingPhase + 0.12) % (Math.PI * 2);
    }, 60);

    // 2. Randomized Non-Robotic Blinking (Blinks for 140ms every 2.5 - 5 seconds)
    const scheduleNextBlink = () => {
      this.state.isBlinking = true;
      setTimeout(() => {
        this.state.isBlinking = false;
      }, 140);

      const delay = Math.floor(2200 + Math.random() * 3800);
      setTimeout(scheduleNextBlink, delay);
    };
    scheduleNextBlink();

    // 3. Independent Ear & Head Micro-Movements
    setInterval(() => {
      if (Math.random() > 0.65) {
        this.state.earTwitchLeft = Math.random() > 0.5 ? -2 : 0;
        this.state.earTwitchRight = Math.random() > 0.5 ? 2 : 0;
        setTimeout(() => {
          this.state.earTwitchLeft = 0;
          this.state.earTwitchRight = 0;
        }, 280);
      }

      // Random head tilt on idle
      if (this.state.action === 'idle' && Math.random() > 0.8) {
        this.state.headTilt = Math.random() > 0.5 ? -2 : 2;
        setTimeout(() => { this.state.headTilt = 0; }, 1500);
      }
    }, 2200);

    // 4. Tail Wagging & Zzz animation step
    setInterval(() => {
      this.state.tailWagAngle = (this.state.tailWagAngle + 1) % 4;
      this.state.zzzFrame = (this.state.zzzFrame + 1) % 3;
    }, 180);
  }

  // Generates SVG Pixel Art Dog markup with Organic Layered Motion
  generateSVG(width = 180, height = 180) {
    const { furColor, bellyColor, earColor, eyeColor, collarColor, outlineColor } = this.config;
    const { action, direction, walkFrame, eyeX, eyeY, breathingPhase, isBlinking, earTwitchLeft, earTwitchRight, headTilt, tailWagAngle, zzzFrame } = this.state;

    const isSleeping = action === 'sleeping';
    const isLyingDown = action === 'lying_down' || isSleeping;
    const isSitting = action === 'sitting';
    const isWalking = action === 'walking' || action === 'stopping';
    const isHappy = action === 'happy' || action === 'excited';
    const isCurious = action === 'curious' || action === 'thinking' || action === 'idle_looking';
    const isSurprised = action === 'surprised' || action === 'bark';
    const isWakingUp = action === 'waking_up';

    // Layered breathing offset (subtle 1px vertical body bob)
    const breathY = (action === 'idle' || isSitting || isLyingDown) ? Math.sin(breathingPhase) * 0.8 : 0;

    // Leg displacement during walking
    const legOffset1 = isWalking ? (walkFrame % 2 === 0 ? -2 : 2) : 0;
    const legOffset2 = isWalking ? (walkFrame % 2 === 0 ? 2 : -2) : 0;

    // Tail wagging offset
    const tailOffsetY = (isHappy || isWalking) ? (tailWagAngle % 2 === 0 ? -2 : 2) : 0;

    // Direction flip transform
    const flipTransform = direction === 'left' ? 'transform="scale(-1, 1) translate(-40, 0)"' : '';

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="${width}" height="${height}" shape-rendering="crispEdges">
        <defs>
          <filter id="dog-stroke" x="-20%" y="-20%" width="140%" height="140%">
            <feMorphology operator="dilate" radius="1" in="SourceAlpha" result="dilated"/>
            <feFlood flood-color="${outlineColor}" result="flood"/>
            <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
            <feMerge>
              <feMergeNode in="outline"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#dog-stroke)" ${flipTransform}>
          <!-- WAGGING TAIL -->
          <g class="dog-tail" transform="translate(0, ${tailOffsetY})">
            <path d="M 28 20 h 4 v -4 h 2 v -4 h -2 z" fill="${furColor}" />
            <rect x="32" y="12" width="2" height="4" fill="${bellyColor}" />
          </g>

          <!-- LEGS -->
          <g class="dog-legs">
            ${isLyingDown ? `
              <!-- Lying Down Paws -->
              <rect x="10" y="29" width="6" height="3" fill="${furColor}" />
              <rect x="24" y="29" width="6" height="3" fill="${furColor}" />
            ` : isSitting ? `
              <!-- Sitting Front & Back Paws -->
              <rect x="12" y="30" width="5" height="4" fill="${furColor}" />
              <rect x="22" y="30" width="5" height="4" fill="${furColor}" />
              <rect x="10" y="28" width="6" height="5" fill="${furColor}" />
            ` : `
              <!-- Standing / Walking Legs -->
              <rect x="11" y="${26 + legOffset1}" width="4" height="8" fill="${furColor}" />
              <rect x="12" y="${31 + legOffset1}" width="4" height="3" fill="${bellyColor}" />
              
              <rect x="23" y="${26 + legOffset2}" width="4" height="8" fill="${furColor}" />
              <rect x="24" y="${31 + legOffset2}" width="4" height="3" fill="${bellyColor}" />
            `}
          </g>

          <!-- BODY WITH LAYERED BREATHING -->
          <g class="dog-body" transform="translate(0, ${breathY})">
            ${isLyingDown ? `
              <rect x="8" y="20" width="22" height="9" fill="${furColor}" rx="1" />
              <rect x="10" y="22" width="10" height="7" fill="${bellyColor}" />
            ` : isSitting ? `
              <rect x="10" y="18" width="18" height="12" fill="${furColor}" rx="1" />
              <rect x="12" y="20" width="8" height="9" fill="${bellyColor}" />
            ` : `
              <rect x="10" y="17" width="20" height="11" fill="${furColor}" rx="1" />
              <rect x="12" y="19" width="10" height="8" fill="${bellyColor}" />
            `}
          </g>

          <!-- COLLAR & TAG -->
          <g class="dog-collar" transform="translate(0, ${breathY})">
            <rect x="11" y="16" width="12" height="2" fill="${collarColor}" />
            <rect x="16" y="17.5" width="2" height="2" fill="#f1c40f" />
          </g>

          <!-- HEAD & INDEPENDENT EARS -->
          <g class="dog-head" transform="translate(${headTilt}, ${breathY + (isCurious ? -1 : isLyingDown ? 2 : 0)})">
            <!-- Left Ear (Floppy & Twitching) -->
            <path d="M 8 6 h 5 v 7 h -3 z" fill="${earColor}" transform="translate(0, ${earTwitchLeft})" />
            
            <!-- Right Ear -->
            <path d="M 21 6 h 5 v 7 h -3 z" fill="${earColor}" transform="translate(0, ${earTwitchRight})" />

            <!-- Main Head Box -->
            <rect x="10" y="8" width="16" height="10" fill="${furColor}" rx="1" />
            
            <!-- White Snout / Muzzle -->
            <rect x="14" y="13" width="10" height="5" fill="${bellyColor}" />

            <!-- Dog Black Nose -->
            <rect x="17" y="12" width="4" height="2" fill="#000000" />
            <rect x="18" y="13.5" width="2" height="1" fill="#ff758c" />

            <!-- EYES & ORGANIC BLINKING -->
            <g transform="translate(${eyeX}, ${eyeY})">
              ${(isSleeping || isBlinking) ? `
                <!-- Sleeping / Blinking Curved Eyes -->
                <rect x="12" y="11" width="3" height="1" fill="${outlineColor}" />
                <rect x="20" y="11" width="3" height="1" fill="${outlineColor}" />
              ` : isHappy ? `
                <!-- Happy Arc Eyes (^^) -->
                <path d="M 12 11 l 2 -2 l 2 2" stroke="${outlineColor}" stroke-width="1" fill="none" />
                <path d="M 20 11 l 2 -2 l 2 2" stroke="${outlineColor}" stroke-width="1" fill="none" />
              ` : isSurprised ? `
                <!-- Surprised Big Eyes -->
                <rect x="11" y="9" width="4" height="5" fill="#ffffff" stroke="${outlineColor}" />
                <rect x="12" y="10" width="2" height="3" fill="${eyeColor}" />
                
                <rect x="19" y="9" width="4" height="5" fill="#ffffff" stroke="${outlineColor}" />
                <rect x="20" y="10" width="2" height="3" fill="${eyeColor}" />
              ` : `
                <!-- Normal Cute Dog Eyes -->
                <rect x="12" y="10" width="3" height="3" fill="${eyeColor}" />
                <rect x="12" y="10" width="1" height="1" fill="#ffffff" />
                
                <rect x="20" y="10" width="3" height="3" fill="${eyeColor}" />
                <rect x="20" y="10" width="1" height="1" fill="#ffffff" />
              `}
            </g>

            <!-- Tongue (if happy/barking/yawning) -->
            ${(isHappy || action === 'bark' || isWakingUp) ? `
              <rect x="18" y="16" width="3" height="3" fill="#ff4757" rx="1" />
            ` : ''}
          </g>

          <!-- SLEEPING ZZZ PARTICLES -->
          ${isSleeping ? `
            <g class="anim-zzz">
              <text x="${24 + zzzFrame * 2}" y="${6 - zzzFrame * 2}" font-size="6" fill="#48dbfb" font-weight="bold">Z</text>
            </g>
          ` : ''}

          <!-- BARK / MUSIC / HEART EFFECTS -->
          ${action === 'bark' ? `
            <g class="anim-bark-notes">
              <text x="26" y="8" font-size="6" fill="#f1c40f" font-weight="bold">Woof!</text>
            </g>
          ` : ''}

          ${isHappy ? `
            <g class="anim-happy-hearts">
              <path d="M 4 4 h 2 v 2 h -2 z" fill="#ff4757" />
              <path d="M 32 3 h 2 v 2 h -2 z" fill="#ff4757" />
            </g>
          ` : ''}
        </g>
      </svg>
    `;
  }
}

// Global Dog Renderer instance
const dogRenderer = new DogRenderer();
