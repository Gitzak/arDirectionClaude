# Claude Arabic RTL Switcher (React + Chrome Extension)

<img width="1920" height="1080" alt="Claude Arabic RTL extension chrome" src="https://github.com/user-attachments/assets/f8bdcc57-1cca-42e4-ab22-5bf01141d6f8" />

Chrome extension popup (React) with a modern switch UI to force `RTL` rendering for Claude response content that contains Arabic text.

## Features

- React popup with modern slide switch.
- Saves setting in `chrome.storage.sync`.
- Applies RTL only to Claude response blocks (`.standard-markdown`) with Arabic text.
- Keeps code blocks in LTR for readability.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Load unpacked extension from `dist/` in `chrome://extensions`.

## Notes

- Works on:
  - `https://claude.ai/*`
  - `https://www.claude.ai/*`
