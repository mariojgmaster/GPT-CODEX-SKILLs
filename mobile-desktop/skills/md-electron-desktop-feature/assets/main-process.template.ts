import { app, BrowserWindow } from 'electron';

let mainWindow: BrowserWindow | null = null;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: PRELOAD_PATH
    }
  });
}

app.whenReady().then(createMainWindow);

