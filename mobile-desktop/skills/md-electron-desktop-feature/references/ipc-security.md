# IPC Security

1. Never expose unrestricted Node access to renderer.
2. Expose only named, minimal preload APIs.
3. Validate IPC payload shape and failure behavior.
4. Keep security-sensitive logic on main side when appropriate.
5. Document renderer trust assumptions clearly.

