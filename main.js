const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs-extra')

function addFiles(files = [], folder = "") {
  dialog.showOpenDialogSync({ properties: ['createDirectory', 'promptToCreate'] })
}

async function handleDirCopy() {
  const { canceled, filePaths } = await dialog.showOpenDialog({ 
    message: 'choose dir',
    properties: ['openDirectory'] 
  })
  if (canceled) {
    return dialog.showMessageBoxSync({ message: 'no path selected' })
  } else {
    return filePaths[0]
  }
}

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
  ipcMain.handle('dialog:copyDir', handleDirCopy)
  ipcMain.handle( 'app:get-files', getFileNames)
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})