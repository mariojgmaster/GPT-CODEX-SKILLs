import { ipcMain } from 'electron';

ipcMain.handle('{IpcChannel}', async (_event, payload: unknown) => {
  return {
    ok: true,
    payload
  };
});

