const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('pixelGridDesktop', Object.freeze({
  isElectron: true,
}));
