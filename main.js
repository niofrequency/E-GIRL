const { app, BrowserWindow, ipcMain, dialog, Menu, Tray, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let tray = null;
let isClickThrough = false;

const settingsPath = path.join(app.getPath('userData'), 'settings.json');

function loadSettings() {
  try {
    if (fs.existsSync(settingsPath)) {
      return JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    }
  } catch (e) {}
  return { opacity: 1, width: 400, height: 600, x: 100, y: 100, lastVideo: null };
}

function saveSettings(settings) {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  } catch (e) {}
}

function createWindow() {
  const settings = loadSettings();

  mainWindow = new BrowserWindow({
    width: settings.width || 400,
    height: settings.height || 600,
    x: settings.x,
    y: settings.y,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: true,
    skipTaskbar: true,
    hasShadow: false,
    backgroundColor: '#00000000',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');
  mainWindow.setAlwaysOnTop(true, 'screen-saver');

  mainWindow.on('moved', () => {
    const bounds = mainWindow.getBounds();
    const settings = loadSettings();
    settings.x = bounds.x;
    settings.y = bounds.y;
    saveSettings(settings);
  });

  mainWindow.on('resized', () => {
    const bounds = mainWindow.getBounds();
    const settings = loadSettings();
    settings.width = bounds.width;
    settings.height = bounds.height;
    saveSettings(settings);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (settings.lastVideo && fs.existsSync(settings.lastVideo)) {
    setTimeout(() => {
      mainWindow.webContents.send('load-video', settings.lastVideo);
    }, 500);
  }
}

function openVideo() {
  dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Videos', extensions: ['webm', 'mp4', 'mov', 'gif', 'avi', 'mkv'] }
    ]
  }).then(result => {
    if (!result.canceled && result.filePaths.length > 0) {
      const filePath = result.filePaths[0];
      const settings = loadSettings();
      settings.lastVideo = filePath;
      saveSettings(settings);
      mainWindow.webContents.send('load-video', filePath);
    }
  });
}

function toggleClickThrough() {
  isClickThrough = !isClickThrough;
  if (mainWindow) {
    mainWindow.setIgnoreMouseEvents(isClickThrough, { forward: true });
    mainWindow.webContents.send('click-through-changed', isClickThrough);
  }
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle('open-video', openVideo);
  ipcMain.handle('toggle-click-through', toggleClickThrough);
  ipcMain.handle('set-opacity', (event, opacity) => {
    if (mainWindow) mainWindow.setOpacity(opacity);
    const settings = loadSettings();
    settings.opacity = opacity;
    saveSettings(settings);
  });
  ipcMain.handle('close-app', () => app.quit());
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
