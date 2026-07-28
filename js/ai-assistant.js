/* ==========================================================================
   SmartNyang — AI Assistant & Intelligence Engine
   ========================================================================== */

class SmartNyangAI {
  constructor() {
    this.mode = 'builtin'; // 'builtin', 'gemini', 'openai', 'ollama'
    this.apiKey = localStorage.getItem('nyang_api_key') || '';
    this.ollamaUrl = localStorage.getItem('nyang_ollama_url') || 'http://localhost:11434';
    
    // Knowledgebase of offline cat smarts
    this.offlineResponses = [
      {
        keywords: ['joke', 'funny', 'humor', 'laugh'],
        replies: [
          "Why do cats make terrible programmers? Because they get distracted by the mouse! 🐭💻",
          "There are 10 types of people in the world: those who understand binary, those who don't, and cats who sleep on the keyboard! ⌨️😴",
          "What is a cat's favorite IDE shortcut? Meow-t + F4! 🐾",
          "I checked your code: 0 compilation errors, 100% chance of needing a cat break! 😸"
        ]
      },
      {
        keywords: ['stretch', 'exercise', 'health', 'posture', 'break'],
        replies: [
          "Time for a Mochi Stretch! 🧘 Roll your shoulders backward 5 times, stretch your fingers, and take a deep breath!",
          "Hydration check! 💧 Take a sip of water right now to keep your brain purring at max efficiency!",
          "20-20-20 Eye Rest Rule: Look at an object 20 feet away for 20 seconds to give your eyes a rest! 👀"
        ]
      },
      {
        keywords: ['focus', 'productivity', 'study', 'work', 'code'],
        replies: [
          "Target locked! 🎯 Break down big tasks into 15-minute chunk meows. You've got this!",
          "Turn off unnecessary notifications, grab your favorite drink, and let's crush this task together! 🐾🚀",
          "Remember: Quality code takes time. Don't rush; write clean, elegant functions!"
        ]
      },
      {
        keywords: ['therapy', 'stress', 'tired', 'sad', 'relax', 'calm'],
        replies: [
          "Soft cat cuddle mode activated! 💖 Close your eyes for 10 seconds and listen to my purr: *purrrrr...* You're doing great!",
          "It's okay to take things one step at a time. Take a slow deep breath in... and exhale. Nyang is right here with you! 🐾"
        ]
      },
      {
        keywords: ['hello', 'hi', 'hey', 'who are you', 'what can you do'],
        replies: [
          "Meow! I'm SmartNyang — your free, smart desktop pet & AI companion! I can monitor your focus, trigger stretch breaks, chat, give coding tips, and customize my look! 🎨🐾",
          "Purrrr! Ready to help you code, study, or stay relaxed!"
        ]
      }
    ];

    this.defaultReplies = [
      "Purrrr... I hear you! Let's keep making progress! 🐾",
      "That's interesting! Remember to take short breaks while working hard! 😸",
      "Nyang is analyzing... Looks like a great day to write clean code! 💻✨",
      "Meow! I'm staying right here on your desktop to cheer you on!"
    ];
  }

  setMode(mode, key = '', ollamaUrl = '') {
    this.mode = mode;
    if (key) {
      this.apiKey = key.trim();
      localStorage.setItem('nyang_api_key', this.apiKey);
    }
    if (ollamaUrl) {
      this.ollamaUrl = ollamaUrl.trim();
      localStorage.setItem('nyang_ollama_url', this.ollamaUrl);
    }
  }

  clearApiKey() {
    this.apiKey = '';
    localStorage.removeItem('nyang_api_key');
  }

  sanitizeText(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  async ask(promptText) {
    promptText = promptText.trim();
    if (!promptText) return "Meow? Ask me anything!";

    let reply = "";
    if (this.mode === 'gemini' && this.apiKey) {
      reply = await this.fetchGemini(promptText);
    } else if (this.mode === 'openai' && this.apiKey) {
      reply = await this.fetchOpenAI(promptText);
    } else if (this.mode === 'ollama') {
      reply = await this.fetchOllama(promptText);
    } else {
      reply = this.getOfflineResponse(promptText);
    }

    return this.sanitizeText(reply);
  }

  getOfflineResponse(input) {
    const text = input.toLowerCase();

    for (const group of this.offlineResponses) {
      if (group.keywords.some(kw => text.includes(kw))) {
        const randIndex = Math.floor(Math.random() * group.replies.length);
        return group.replies[randIndex];
      }
    }

    const randDefault = Math.floor(Math.random() * this.defaultReplies.length);
    return this.defaultReplies[randDefault];
  }

  // Google Gemini API call (using HTTP headers for key security)
  async fetchGemini(prompt) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are SmartNyang, a cute, highly intelligent pixel cat desktop companion. Give a short, helpful response (max 2 sentences) ending with a cat emoji: ${prompt}` }] }]
        })
      });
      const data = await res.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text || "Meow!";
      }
      return "Meow! Couldn't parse response from Gemini.";
    } catch (e) {
      return "Meow! Error connecting to Gemini API. Please check your network and API key.";
    }
  }

  // OpenAI ChatGPT API call
  async fetchOpenAI(prompt) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are SmartNyang, a cute pixel cat AI assistant. Keep replies under 2 sentences.' },
            { role: 'user', content: prompt }
          ]
        })
      });
      const data = await res.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content || "Meow!";
      }
      return "Meow! OpenAI API error.";
    } catch (e) {
      return "Meow! OpenAI API connection error.";
    }
  }

  // Local Ollama LLM call
  async fetchOllama(prompt) {
    try {
      const res = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama2',
          prompt: `You are SmartNyang, a cat companion. Reply concisely: ${prompt}`,
          stream: false
        })
      });
      const data = await res.json();
      return data.response || "Meow!";
    } catch (e) {
      return "Meow! Could not connect to local Ollama server at " + this.ollamaUrl;
    }
  }
}

// Global AI singleton instance
const nyangAI = new SmartNyangAI();
