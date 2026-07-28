const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  moveWindow: (deltaX, deltaY) => ipcRenderer.send('pet-move', { deltaX, deltaY }),
  onAppContextChanged: (callback) => ipcRenderer.on('app-context-changed', (event, appName) => callback(appName)),
  openContextMenu: () => ipcRenderer.send('pet-context-menu'),
  onToggleMovement: (callback) => ipcRenderer.on('toggle-movement', (event, enabled) => callback(enabled))
});
