import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import axios from 'axios'
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';



// #################### log section #########################
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');
autoUpdater.on('checking-for-update', () => log.info('Checking for updates...'));
autoUpdater.on('update-available', (info) => log.info('Update available:', info.version));
autoUpdater.on('update-not-available', (info) => log.info('No update available:', info.version));
autoUpdater.on('error', (err) => log.error('Error in auto-updater:', err));
autoUpdater.on('download-progress', (progress) => log.info(`Download speed: ${progress.bytesPerSecond}, Progress: ${progress.percent}%`));


// #################### update section #########################
let userAcknowledgedUpdate = false;

autoUpdater.on('update-available', (info) => {
  console.log('[Updater] Update available:', info.version);
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Available',
    message: 'A new update is available. Downloading now...'
  }).then(()=>{
    userAcknowledgedUpdate = true
  })
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('[Updater] Update downloaded:', info.version);
  log.info('Update downloaded — quitting and installing...');
  autoUpdater.quitAndInstall();

  // const waitForUserAck = () => {
  //   if (userAcknowledgedUpdate){
  //     dialog.showMessageBox({
  //       type: 'info',
  //       title: 'Update Ready',
  //       message: 'Install & restart now?',
  //       buttons: ['Yes', 'Later']
  //     }).then(result => {
  //       if (result.response === 0) {
  //         autoUpdater.quitAndInstall(); 
  //       }
  //     });    
  //   }else {
  //     setTimeout(waitForUserAck, 1000)
  //   }
  // }
  // waitForUserAck();
});

// #################### server section #########################
const { spawn } = require('child_process');
const path = require('path');

let flaskProcess;

function startServer(){
  try{
    const exePath = path.join(process.resourcesPath, 'server.exe');
    // console.log('Starting Flask server at:', exePath);
    flaskProcess = spawn(exePath);
    flaskProcess.stdout.on('data', data => {
      console.log(`Flask stdout: ${data.toString()}`);
    });

    flaskProcess.stderr.on('data', data => {
      console.error(`Flask stderr: ${data.toString()}`);
    });

    flaskProcess.on('close', code => {
      console.log(`Flask process exited with code ${code}`);
      log.info(`Server is shutting down due to code: ${code}`)
    });

    flaskProcess.on('error', err => {
      log.error('SERVER FAILED TO START')
      log.error(err)
      console.error('Flask process failed:', err);
    });
    
    return 
  } catch {
    log.error('SERVER FAILED TO RUN ')
  }
} 

// #################### app section #########################

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 300,
    minHeight: 500,
    // alwaysOnTop: true,
    show: false,
    autoHideMenuBar: true,

    
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      backgroundColor: '#1a1a1a',
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    // mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  const isPackaged = app.isPackaged;
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('isPackaged', isPackaged);
  });

  mainWindow.openDevTools();
  

  // autoUpdater.check
  // if (app.isPackaged) {
  //   // ForUpdatesAndNotify();
  //   autoUpdater.checkForUpdatesAndNotify();
  // } 
}

  const waitForServerReady = async () => {
    while (true) {
      try {
        await fetch('http://localhost:8080/');
        log.info('Server was pinged')
        break;
      } catch {
        await new Promise(res => setTimeout(res, 200));
      }
    }
  };

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  if (app.isPackaged) {
    log.info('Server is starting')
    startServer();
    log.info('Attempting to ping server')
    await waitForServerReady();
  }
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  log.info('Creating window')
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  if (app.isPackaged) {
    log.info('Checking for update')
    autoUpdater.checkForUpdatesAndNotify();
    log.info('Update check completed')
  } 



})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', async (event) => {
  if (app.isPackaged){
    event.preventDefault(); 

    try {
      await axios.get('http://localhost:8080/killserver');
      console.log('Server shutdown request sent');
    } catch (err) {
      console.error('Failed to kill server:', err);
    }
    app.exit();     
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
