const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('figgy', {
    getFiles: (folder) => ipcRenderer.invoke('app:get-files', folder),
    copyDir: () => ipcRenderer.invoke('dialog:copyDir')
})