import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Will be expanded in later tasks
  send: (channel: string, data: unknown) => ipcRenderer.send(channel, data),
  receive: (channel: string, func: (...args: unknown[]) => void) => {
    ipcRenderer.on(channel, (_event, ...args) => func(...args));
  },
});
