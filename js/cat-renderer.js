/* ==========================================================================
   SmartNyang — SVG Pixel Cat Renderer & Interactive Animation Engine
   ========================================================================== */

class CatRenderer {
  constructor() {
    this.config = {
      furColor: '#f3cfab',
      patternStyle: 'tabby', // 'tabby', 'calico', 'tuxedo', 'solid'
      eyeColor: '#ef9268',
      hatAccessory: 'none', // 'none', 'wizard', 'chef', 'crown', 'headphones', 'party'
      collarAccessory: 'red_bell', // 'red_bell', 'bowtie', 'scarf', 'none'
      outlineColor: '#000000'
    };

    this.state = {
      action: 'idle', // 'idle', 'kneading', 'sleeping', 'purring', 'overheat', 'thinking', 'jump'
      eyeX: 0,
      eyeY: 0
    };
  }

  setConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  setAction(actionName) {
    this.state.action = actionName;
  }

  setEyeOffset(dx, dy) {
    // Limit eye displacement between -3px and +3px for crisp pixel look
    this.state.eyeX = Math.max(-3, Math.min(3, dx));
    this.state.eyeY = Math.max(-3, Math.min(3, dy));
  }

  // Generates complete clean SVG Pixel Art Cat markup
  generateSVG(width = 220, height = 220) {
    const { furColor, patternStyle, eyeColor, hatAccessory, collarAccessory, outlineColor } = this.config;
    const { action, eyeX, eyeY } = this.state;

    // Derived pattern colors
    const darkPatternColor = this.adjustColor(furColor, -40);
    const whitePatchColor = '#ffffff';

    // Sleep eyes override
    const isSleeping = action === 'sleeping';

    // SVG Crisp Edges Pixel Art Definition
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="${width}" height="${height}" shape-rendering="crispEdges">
        <defs>
          <filter id="cat-stroke" x="-20%" y="-20%" width="140%" height="140%">
            <feMorphology operator="dilate" radius="1" in="SourceAlpha" result="dilated"/>
            <feFlood flood-color="${outlineColor}" result="flood"/>
            <feComposite in="flood" in2="dilated" operator="in" result="outline"/>
            <feMerge>
              <feMergeNode in="outline"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#cat-stroke)">
          <!-- TAIL -->
          <g class="cat-part-tail">
            <path d="M 30 24 h 4 v -2 h 2 v -4 h -2 v -2 h -2 v 4 h -2 z" fill="${furColor}" />
            ${patternStyle === 'tabby' ? `<path d="M 32 20 h 2 v 2 h -2 z" fill="${darkPatternColor}" />` : ''}
          </g>

          <!-- LEGS -->
          <g class="cat-part-legs">
            <!-- Left Leg -->
            <rect x="11" y="27" width="5" height="7" fill="${furColor}" />
            ${patternStyle === 'tuxedo' ? `<rect x="11" y="31" width="5" height="3" fill="${whitePatchColor}" />` : ''}
            <!-- Right Leg -->
            <rect x="24" y="27" width="5" height="7" fill="${furColor}" />
            ${patternStyle === 'tuxedo' ? `<rect x="24" y="31" width="5" height="3" fill="${whitePatchColor}" />` : ''}
          </g>

          <!-- BODY -->
          <g class="cat-part-body">
            <rect x="10" y="18" width="20" height="11" fill="${furColor}" rx="1" />
            
            <!-- Fur Pattern Overlays -->
            ${patternStyle === 'tabby' ? `
              <rect x="18" y="19" width="4" height="2" fill="${darkPatternColor}" />
              <rect x="18" y="23" width="4" height="2" fill="${darkPatternColor}" />
            ` : ''}

            ${patternStyle === 'calico' ? `
              <rect x="12" y="19" width="5" height="5" fill="#e67e22" />
              <rect x="22" y="21" width="6" height="5" fill="#2c3e50" />
            ` : ''}

            ${patternStyle === 'tuxedo' ? `
              <rect x="16" y="20" width="8" height="9" fill="${whitePatchColor}" />
            ` : ''}
          </g>

          <!-- HEAD & EARS -->
          <g class="cat-part-head">
            <!-- Left Ear -->
            <path d="M 9 6 h 5 v 5 h -5 z" fill="${furColor}" />
            <path d="M 10 7 h 3 v 3 h -3 z" fill="#ffb8c6" />
            
            <!-- Right Ear -->
            <path d="M 26 6 h 5 v 5 h -5 z" fill="${furColor}" />
            <path d="M 27 7 h 3 v 3 h -3 z" fill="#ffb8c6" />

            <!-- Main Head Box -->
            <rect x="8" y="9" width="24" height="12" fill="${furColor}" rx="1" />
            
            <!-- Tabby Head Stripes -->
            ${patternStyle === 'tabby' ? `
              <rect x="19" y="9" width="2" height="3" fill="${darkPatternColor}" />
              <rect x="15" y="9" width="2" height="2" fill="${darkPatternColor}" />
              <rect x="23" y="9" width="2" height="2" fill="${darkPatternColor}" />
            ` : ''}

            <!-- EYES -->
            <g transform="translate(${eyeX}, ${eyeY})">
              ${isSleeping ? `
                <!-- Sleeping Eyes (Curved lines) -->
                <rect x="12" y="13" width="4" height="1" fill="${outlineColor}" />
                <rect x="24" y="13" width="4" height="1" fill="${outlineColor}" />
              ` : `
                <!-- Normal Open Pixel Eyes -->
                <!-- Left Eye -->
                <rect x="12" y="12" width="4" height="4" fill="${eyeColor}" />
                <rect x="13" y="13" width="2" height="2" fill="${outlineColor}" />
                <rect x="12" y="12" width="1" height="1" fill="#ffffff" />
                
                <!-- Right Eye -->
                <rect x="24" y="12" width="4" height="4" fill="${eyeColor}" />
                <rect x="25" y="13" width="2" height="2" fill="${outlineColor}" />
                <rect x="24" y="12" width="1" height="1" fill="#ffffff" />
              `}
            </g>

            <!-- NOSE & MOUTH -->
            <rect x="19" y="15" width="2" height="1" fill="#ff758c" />
            <!-- Muzzle cheeks -->
            <rect x="18" y="16" width="4" height="1" fill="${this.adjustColor(furColor, -15)}" />

            <!-- WHISKERS -->
            <rect x="4" y="14" width="3" height="1" fill="${outlineColor}" />
            <rect x="4" y="16" width="3" height="1" fill="${outlineColor}" />
            <rect x="33" y="14" width="3" height="1" fill="${outlineColor}" />
            <rect x="33" y="16" width="3" height="1" fill="${outlineColor}" />
          </g>

          <!-- COLLAR ACCESSORY -->
          <g class="cat-part-collar">
            ${collarAccessory === 'red_bell' ? `
              <rect x="12" y="19" width="16" height="2" fill="#e74c3c" />
              <rect x="19" y="20" width="2" height="2" fill="#f1c40f" />
            ` : ''}
            ${collarAccessory === 'bowtie' ? `
              <path d="M 17 19 h 6 v 2 h -6 z" fill="#e74c3c" />
              <rect x="19" y="18.5" width="2" height="3" fill="#c0392b" />
            ` : ''}
            ${collarAccessory === 'scarf' ? `
              <rect x="10" y="18" width="20" height="3" fill="#9b59b6" />
              <rect x="23" y="21" width="4" height="5" fill="#8e44ad" />
            ` : ''}
          </g>

          <!-- HAT / HEAD ACCESSORY -->
          <g class="cat-part-hat">
            ${hatAccessory === 'wizard' ? `
              <path d="M 15 8 L 20 0 L 25 8 Z" fill="#341f97" />
              <rect x="13" y="7" width="14" height="2" fill="#54a0ff" />
              <rect x="19" y="3" width="2" height="2" fill="#feca57" />
            ` : ''}
            ${hatAccessory === 'chef' ? `
              <rect x="15" y="3" width="10" height="6" fill="#ffffff" rx="2" />
              <rect x="14" y="8" width="12" height="2" fill="#dddddd" />
            ` : ''}
            ${hatAccessory === 'crown' ? `
              <path d="M 14 8 L 14 3 L 17 6 L 20 2 L 23 6 L 26 3 L 26 8 Z" fill="#f1c40f" />
              <rect x="20" y="5" width="1" height="1" fill="#e74c3c" />
            ` : ''}
            ${hatAccessory === 'headphones' ? `
              <path d="M 8 11 A 12 12 0 0 1 32 11" fill="none" stroke="#222f3e" stroke-width="2" />
              <rect x="6" y="9" width="3" height="7" fill="#ff4757" rx="1" />
              <rect x="31" y="9" width="3" height="7" fill="#ff4757" rx="1" />
            ` : ''}
            ${hatAccessory === 'party' ? `
              <path d="M 17 9 L 20 2 L 23 9 Z" fill="#ff6b6b" />
              <circle cx="20" cy="2" r="1" fill="#feca57" />
            ` : ''}
          </g>

          <!-- ANIMATION OVERLAYS (Purr hearts, Overheat fire, Thinking bulb) -->
          ${action === 'purring' ? `
            <g class="anim-purr-hearts">
              <path d="M 6 4 h 2 v 2 h -2 z M 5 5 h 4 v 2 h -4 z M 6 7 h 2 v 1 h -2 z" fill="#ff4757" />
              <path d="M 32 3 h 2 v 2 h -2 z M 31 4 h 4 v 2 h -4 z M 32 6 h 2 v 1 h -2 z" fill="#ff4757" />
            </g>
          ` : ''}

          ${action === 'overheat' ? `
            <g class="anim-overheat-steam">
              <rect x="10" y="2" width="2" height="4" fill="#ff9f43" />
              <rect x="28" y="2" width="2" height="4" fill="#ff9f43" />
            </g>
          ` : ''}

          ${action === 'thinking' ? `
            <g class="anim-thinking-bulb">
              <rect x="20" y="0" width="4" height="4" fill="#feca57" />
            </g>
          ` : ''}
        </g>
      </svg>
    `;
  }

  // Utility to darken/lighten color
  adjustColor(col, amt) {
    let usePound = false;
    if (col[0] == "#") {
      col = col.slice(1);
      usePound = true;
    }
    let num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255; else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255; else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255; else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
  }
}

// Global renderer instance
const catRenderer = new CatRenderer();
