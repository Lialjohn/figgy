const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('figgy', {
    getImages: (choice) => ipcRenderer.invoke('get-images', choice),
})