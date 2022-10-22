const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('figgy', {
    // get stuff from fs
    getFiles: (folder) => ipcRenderer.invoke('app:get-files', folder),
    // get stuff from store
    getStoreItem: (key) => ipcRenderer.invoke('app:get-store-item', key),
    addEntry: (entry) => ipcRenderer.invoke('app:add-entry', entry),
    removeEntry: (i) => ipcRenderer.invoke('app:remove-entry', i),
    setCats: (cat) => ipcRenderer.invoke('app:set-cats', cat),
    setActivePlaylist: (name) => ipcRenderer.invoke('app:set-active-playlist', name),
    savePlaylist: (name) => ipcRenderer.invoke('app:save-playlist', name)
})