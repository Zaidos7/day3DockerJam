// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("sandboxAPI", {
  start: () => ipcRenderer.invoke("start"),
  stop: () => ipcRenderer.invoke("stop"),
  logs: () => ipcRenderer.invoke("logs"),
  reset: () => ipcRenderer.invoke("reset"),
  network: () => ipcRenderer.invoke("network"),
});
