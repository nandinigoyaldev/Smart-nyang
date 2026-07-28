# Security Policy — SmartNyang Desktop Pet

## Security & Privacy Commitment

SmartNyang is designed with privacy and safety as top priorities. It operates locally on your machine without mandatory cloud tracking or analytics.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Architecture

1. **Electron Security**:
   - `contextIsolation` is enabled (`true`).
   - `nodeIntegration` is disabled (`false`).
   - Process sandboxing and Web Security policies are strictly enforced.

2. **Python Desktop App (`mac_pet.py`)**:
   - Built with persistent canvas rendering to ensure **zero memory leaks** and low CPU overhead (<1% CPU, <30MB RAM).
   - Graceful signal handlers (`SIGINT`/`SIGTERM`) to prevent orphan system processes.

3. **API Keys & Privacy**:
   - Optional AI API keys (Google Gemini / OpenAI) are stored locally in client-side storage.
   - API requests pass credentials via secure HTTP headers (`x-goog-api-key`, `Authorization`) rather than query parameter URLs.

## Reporting a Vulnerability

If you discover a potential security issue in SmartNyang, please report it via GitHub Issues or contact the maintainers directly. Vulnerabilities will be addressed promptly.
