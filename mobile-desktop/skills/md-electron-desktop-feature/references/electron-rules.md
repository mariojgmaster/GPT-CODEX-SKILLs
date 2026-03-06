# Electron Rules

1. Keep main-process responsibilities separate from renderer UI.
2. Put privileged APIs behind preload and typed IPC contracts.
3. Prefer narrow, auditable IPC surfaces.
4. Consider menu, tray, multi-window, and keyboard interactions when relevant.
5. Track packaging and auto-update implications for changed behavior.

