const { app, shell, ipcMain, dialog, BrowserWindow } = require('electron')
const addon = require('../native');
const path = require('path')
const url = require('url')
const fs = require('fs')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800, height: 600, center: true, resizable: false,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  /*mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  }))*/
  mainWindow.loadURL('http://localhost:3000/');
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('', (ev, cmd, arg) => {
  switch (cmd) {
    case 'get_sessions':
      // XXX
      ev.sender.send('', 'recent_sessions', [
        {name: 'sosse', details: 'AVR ATmega122, 4K flash, 42 functions', timestamp: 'Yesterday'},
        {name: 'static', details: ' ELF static executable, x86-64, 88 functions', timestamp: 'Yesterday'},
        {name: 'panopticon', details: 'ELF shared object, x86-64, 124 functions', timestamp: 'Yesterday'}
      ]);
      break;

    case 'get_suggestions':
      console.log("get_suggestions", arg)
      fs.readdir(arg, (err, files) => {
        if (files) {
          const contents = files
            .filter((x) => !x.startsWith('.'))
            .map((x) => {
              const p = path.resolve(arg, x);
              const st = fs.statSync(p);
              return { 'name': x, 'isdir': st.isDirectory() };
            });

          ev.sender.send('', 'file_suggestions', {
            'dir': arg,
            'contents': contents
          });
        } else {
          ev.sender.send('', 'file_suggestions', {
            'dir': arg,
            'contents': []
          });
        }
      })
      break

    case 'open_file_browser':
      dialog.showOpenDialog(
        mainWindow,
        {
          title: 'Disassemble fresh file',
          properties: ['openFile'],
        },
        (paths) => { console.log(paths); }
      );
      break;

    default:
      console.error('Got unknown command in main thread: ', cmd);
      break;
  }
});
