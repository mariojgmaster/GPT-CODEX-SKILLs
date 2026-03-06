import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('{BridgeName}', {
  invoke: (channel: string, payload: unknown) => ipcRenderer.invoke(channel, payload)
});

