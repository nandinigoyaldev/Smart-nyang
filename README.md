# 🐱 SmartNyang — Lightweight Desktop Pixel Pet & AI Companion

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](LICENSE)
[![Security: Audited](https://img.shields.io/badge/Security-Strict_Sandboxing-success.svg)](SECURITY.md)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows-blue.svg)]()
[![Memory Usage](https://img.shields.io/badge/RAM_Usage-%3C30MB-success.svg)]()

> **SmartNyang** is a free, open-source, desktop pixel cat mascot that sits directly on your screen (a compact, frameless floating laptop pet window). It tracks your mouse cursor, reacts with cute animations, plays synthesized Web Audio meows/purrs, displays speech bubbles, and provides a popover menu for AI chat, focus timers, and fur customization!

---

## 🔒 Security & Performance Features

- **Zero Memory Leaks & Ultra Low CPU**: Optimized persistent rendering engine (<1% CPU and <30MB RAM usage). Safe against macOS WindowServer lockups.
- **Strict Electron Sandboxing**: `contextIsolation: true`, `nodeIntegration: false`, and process sandboxing enabled.
- **Secure API Key Handling**: Passwords and API credentials (Google Gemini / OpenAI) are passed via secure HTTP headers and sanitized against XSS.

---

## ⚡ Quick Start (1-Click Launch)

### 🍎 macOS
Double-click `launch_mac.command`! It launches SmartNyang as a standalone floating desktop app on your Mac.

### 🪟 Windows
Double-click `launch_windows.bat`! It opens SmartNyang as a standalone app window on your screen.

### ⚡ Electron / Developer Mode
```bash
npm install
npm start
```

---

## 🎮 Features & Interactions

1. **Mouse Cursor Follow**: Move your mouse cursor around your screen — SmartNyang's pixel eyes follow your pointer!
2. **Speech Bubble & Audio**: Click the cat to hear synthesized pixel meows/purrs and view interactive tips.
3. **Control Panel (`⚙️ Nyang AI`)**:
   - **💬 AI Chat**: Offline smart replies + optional Google Gemini / OpenAI / Ollama integration.
   - **🎬 Actions**: Trigger animations (Typing Paw, Sleep Mode, Purring Hearts, Jump, Overheat).
   - **⏱️ Focus Suite**: Pomodoro timer with hydration & stretch break reminders.
   - **🎨 Fur Studio**: Customize colors (Orange, Calico, Tuxedo, Pink, Dark) & hats (Wizard, Chef, Crown, Headphones).

---

## 📄 Security & License

- **Security Policy**: See [SECURITY.md](SECURITY.md) for vulnerability reporting and architecture details.
- **License**: Licensed under the **MIT License** — free for personal use and modification.
