const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs-extra')
const url = require('url')
const { createWindow } = require('./window.js')

function getFileNames(_, folder) {
  let dir = path.join('./images', (folder || ""))
  const files = fs.readdirSync(dir)
  return files.map(fileName => {
    let filePath = folder ? path.join(__dirname, 'images', folder, fileName) : dir
    if (process.platform === 'win32') filePath = filePath.replace(/\\/g, '/')
    return { name: fileName, path: filePath }
  })
}

// function createWindow () {
//   const mainWindow = new BrowserWindow({
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js')
//     }
//   })
  // mainWindow.webContents.openDevTools()
//   // mainWindow.loadFile('index.html')
//   mainWindow.loadURL(
//     url.format({
//       pathname: path.join(__dirname, "index.html"),
//       protocol: "file:",
//       slashes: true
//     })
//   );
// }

app.on("ready", () => {
  // setApplicationMenu();
  // initIpc();
  ipcMain.handle( 'app:get-files', getFileNames)

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      // Two properties below are here for demo purposes, and are
      // security hazard. Make sure you know what you're doing
      // in your production app.
      // nodeIntegration: true,
      // contextIsolation: false,
      // Spectron needs access to remote module

      preload: path.join(__dirname, 'preload.js'),

    }
  });
  mainWindow.webContents.openDevTools()

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true
    })
  );
    
});

// app.whenReady().then(() => {
//   ipcMain.handle( 'app:get-files', getFileNames)
//   app.on('activate', function () {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow()
//   })
// })

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})