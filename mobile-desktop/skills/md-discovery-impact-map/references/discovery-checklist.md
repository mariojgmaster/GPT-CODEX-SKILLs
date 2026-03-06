# Discovery Checklist

1. Identify the feature owner path or package.
2. Identify touched artifact categories:
   - `app/`, `src/`, `packages/`, `components/`, `hooks/`
   - `electron/`, `main/`, `preload/`, `renderer/`
   - `ios/`, `android/`, `expo/`
   - config files such as `package.json`, `app.json`, `app.config.*`, `eas.json`, `electron-builder.*`, `tsconfig.*`
3. Map dependencies:
   - navigation
   - state management
   - API or data-fetching
   - native modules
   - packaging or release config
4. Define minimal validation set:
   - targeted tests
   - typecheck/lint scope
   - build or package checks
5. Register out-of-scope artifacts.

