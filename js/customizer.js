/* ==========================================================================
   SmartNyang — Cat Studio & Showcase Pattern Engine
   ========================================================================== */

const showcasePresets = [
  {
    name: "Firefly Tabby",
    config: { furColor: "#f3cfab", patternStyle: "tabby", eyeColor: "#ef9268", hatAccessory: "wizard", collarAccessory: "red_bell", outlineColor: "#000000" },
    saves: 142
  },
  {
    name: "Mochi Tuxedo",
    config: { furColor: "#2f3542", patternStyle: "tuxedo", eyeColor: "#1dd1a1", hatAccessory: "crown", collarAccessory: "bowtie", outlineColor: "#000000" },
    saves: 98
  },
  {
    name: "Sakura Blossom",
    config: { furColor: "#ffcdd2", patternStyle: "calico", eyeColor: "#9c88ff", hatAccessory: "party", collarAccessory: "scarf", outlineColor: "#000000" },
    saves: 215
  },
  {
    name: "Cyber Gamer Nyang",
    config: { furColor: "#48dbfb", patternStyle: "tabby", eyeColor: "#ff65a3", hatAccessory: "headphones", collarAccessory: "bowtie", outlineColor: "#000000" },
    saves: 184
  },
  {
    name: "Chef Caramel",
    config: { furColor: "#e67e22", patternStyle: "solid", eyeColor: "#f1c40f", hatAccessory: "chef", collarAccessory: "red_bell", outlineColor: "#000000" },
    saves: 110
  }
];

function initCustomizer() {
  const inputs = ['opt-fur-color', 'opt-pattern-style', 'opt-eye-color', 'opt-hat-accessory', 'opt-collar-accessory', 'opt-outline-color'];
  
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updateStudioPreview);
    }
  });

  renderShowcaseGrid();
  updateStudioPreview();
}

function updateStudioPreview() {
  const config = getFormConfig();
  catRenderer.setConfig(config);
  
  // Render to customizer studio preview box
  const studioBox = document.getElementById('studio-cat-svg');
  if (studioBox) {
    studioBox.innerHTML = catRenderer.generateSVG(240, 240);
  }

  // Also update stage main cat
  if (window.renderStageCat) {
    window.renderStageCat();
  }
}

function getFormConfig() {
  return {
    furColor: document.getElementById('opt-fur-color').value,
    patternStyle: document.getElementById('opt-pattern-style').value,
    eyeColor: document.getElementById('opt-eye-color').value,
    hatAccessory: document.getElementById('opt-hat-accessory').value,
    collarAccessory: document.getElementById('opt-collar-accessory').value,
    outlineColor: document.getElementById('opt-outline-color').value
  };
}

function applyPreset(presetName) {
  const presets = {
    orange: { furColor: "#f3cfab", patternStyle: "tabby", eyeColor: "#ef9268", hatAccessory: "wizard", collarAccessory: "red_bell" },
    calico: { furColor: "#ffffff", patternStyle: "calico", eyeColor: "#2ed573", hatAccessory: "party", collarAccessory: "red_bell" },
    tuxedo: { furColor: "#2f3542", patternStyle: "tuxedo", eyeColor: "#1dd1a1", hatAccessory: "crown", collarAccessory: "bowtie" },
    pink: { furColor: "#ffcdd2", patternStyle: "solid", eyeColor: "#ff65a3", hatAccessory: "headphones", collarAccessory: "scarf" },
    dark: { furColor: "#1e272e", patternStyle: "solid", eyeColor: "#feca57", hatAccessory: "none", collarAccessory: "bowtie" },
    gold: { furColor: "#f1c40f", patternStyle: "tabby", eyeColor: "#ff4757", hatAccessory: "crown", collarAccessory: "red_bell" }
  };

  const selected = presets[presetName];
  if (selected) {
    document.getElementById('opt-fur-color').value = selected.furColor;
    document.getElementById('opt-pattern-style').value = selected.patternStyle;
    document.getElementById('opt-eye-color').value = selected.eyeColor;
    document.getElementById('opt-hat-accessory').value = selected.hatAccessory;
    document.getElementById('opt-collar-accessory').value = selected.collarAccessory;
    updateStudioPreview();
  }
}

function randomizeCat() {
  const colors = ['#f3cfab', '#2f3542', '#ffcdd2', '#48dbfb', '#e67e22', '#f1c40f', '#a29bfe'];
  const patterns = ['tabby', 'calico', 'tuxedo', 'solid'];
  const hats = ['none', 'wizard', 'chef', 'crown', 'headphones', 'party'];
  const collars = ['red_bell', 'bowtie', 'scarf', 'none'];

  document.getElementById('opt-fur-color').value = colors[Math.floor(Math.random() * colors.length)];
  document.getElementById('opt-pattern-style').value = patterns[Math.floor(Math.random() * patterns.length)];
  document.getElementById('opt-eye-color').value = colors[Math.floor(Math.random() * colors.length)];
  document.getElementById('opt-hat-accessory').value = hats[Math.floor(Math.random() * hats.length)];
  document.getElementById('opt-collar-accessory').value = collars[Math.floor(Math.random() * collars.length)];
  updateStudioPreview();

  catAudio.playMeow(1.4);
}

function exportCatCode() {
  const config = getFormConfig();
  const jsonCode = btoa(JSON.stringify(config));
  navigator.clipboard.writeText(jsonCode);
  alert("📋 SmartNyang Pattern Code copied to clipboard! Share it with friends or in the Showcase!");
}

function importCatCode() {
  const input = document.getElementById('import-code-input').value.trim();
  if (!input) return;

  try {
    const jsonString = atob(input);
    const config = JSON.parse(jsonString);
    catRenderer.setConfig(config);
    
    document.getElementById('opt-fur-color').value = config.furColor || '#f3cfab';
    document.getElementById('opt-pattern-style').value = config.patternStyle || 'tabby';
    document.getElementById('opt-eye-color').value = config.eyeColor || '#ef9268';
    document.getElementById('opt-hat-accessory').value = config.hatAccessory || 'none';
    document.getElementById('opt-collar-accessory').value = config.collarAccessory || 'none';

    updateStudioPreview();
    alert("✨ SmartNyang Pattern successfully imported!");
  } catch (e) {
    alert("Invalid pattern code!");
  }
}

function renderShowcaseGrid() {
  const grid = document.getElementById('showcase-grid');
  if (!grid) return;

  grid.innerHTML = '';

  showcasePresets.forEach(item => {
    // Generate mini cat SVG preview
    const tempRenderer = new CatRenderer();
    tempRenderer.setConfig(item.config);
    const svgHTML = tempRenderer.generateSVG(140, 140);

    const card = document.createElement('div');
    card.className = 'showcase-card';
    card.innerHTML = `
      <div class="showcase-media">${svgHTML}</div>
      <div class="showcase-title">${item.name}</div>
      <button class="btn-secondary btn-sm" onclick='applyShowcasePreset(${JSON.stringify(item.config)})'>
        💖 Load Pattern (${item.saves} saves)
      </button>
    `;
    grid.appendChild(card);
  });
}

function applyShowcasePreset(config) {
  catRenderer.setConfig(config);
  document.getElementById('opt-fur-color').value = config.furColor;
  document.getElementById('opt-pattern-style').value = config.patternStyle;
  document.getElementById('opt-eye-color').value = config.eyeColor;
  document.getElementById('opt-hat-accessory').value = config.hatAccessory;
  document.getElementById('opt-collar-accessory').value = config.collarAccessory;
  
  updateStudioPreview();
  switchTab('companion');
  if (window.showCatSpeech) {
    window.showCatSpeech("Pattern Loaded! Meow! 💖", 4000);
  }
  catAudio.playPurr();
}
