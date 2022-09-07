const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs-extra')

function getFileNames(_, folder) {
  let dir = path.join('./images', (folder || ""))
  const files = fs.readdirSync(dir)
  return files.map(fileName => {
    const filePath = folder ? path.join(__dirname, 'images', folder, fileName) : dir
    return { name: fileName, path: filePath }
  })
}

function createWindow () {
  const mainWindow = new BrowserWindow({
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
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})