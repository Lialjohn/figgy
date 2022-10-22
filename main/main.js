const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs-extra')
const handle = require('./handlers/home')

function getFileNames(_, folder) {
  let dir = path.join('./images', (folder || ""))
  const files = fs.readdirSync(dir)
  return files.map(fileName => {
    const filePath = folder ? path.join(dir, fileName) : dir
    return { name: fileName, path: filePath }
  })
}

function createWindow () {
  const mainWindow = new BrowserWindow({
    backgroundColor: '#7f8a90',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    }
  })
  mainWindow.webContents.openDevTools()
  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  ipcMain.handle( 'app:get-files', getFileNames)
  ipcMain.handle('app:get-store-item', handle.getStoreItem),
  ipcMain.handle('app:add-entry', handle.addEntry)
  ipcMain.handle('app:remove-entry', handle.removeEntry)
  ipcMain.handle('app:set-cats', handle.setCats)
  ipcMain.handle('app:set-active-playlist', handle.setActivePlaylist)
  ipcMain.handle('app:save-playlist', handle.savePlaylist)
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  // self reminder: window needs to be closed normally. Just ending process doesn't count.
  handle.clearActivePlaylist()
  if (process.platform !== 'darwin') app.quit()
})