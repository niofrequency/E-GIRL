const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openVideo: () => ipcRenderer.invoke('open-video'),
  toggleClickThrough: () => ipcRenderer.invoke('toggle-click-through'),
  setOpacity: (opacity) => ipcRenderer.invoke('set-opacity', opacity),
  closeApp: () => ipcRenderer.invoke('close-app'),
  onLoadVideo: (callback) => ipcRenderer.on('load-video', (event, path) => callback(path)),
  onClickThroughChanged: (callback) => ipcRenderer.on('click-through-changed', (event, state) => callback(state))
});
