const { app, BrowserWindow, screen, ipcMain, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow = null;
let tray = null;
let lastActiveAppName = '';
let isMovementEnabled = true;

function createDesktopDogWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  const winWidth = 220;
  const winHeight = 240;
  const startX = Math.max(10, screenWidth - winWidth - 40);
  const startY = Math.max(10, screenHeight - winHeight - 40);

  mainWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    x: startX,
    y: startY,
    transparent: true,      // 100% OS level transparent window background
    frame: false,            // Undecorated window: No titlebar, no close/min/max buttons
    alwaysOnTop: true,       // Float on top of desktop apps
    hasShadow: false,        // Disable rectangular shadow artifact on transparent window
    resizable: false,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    }
  });

  // Load dedicated Desktop Dog UI (Zero UI controls)
  mainWindow.loadFile(path.join(__dirname, '../pet.html'));

  // Priority 1: Set Always On Top to 'screen-saver' tier so window stays above Spotify, Chrome, VS Code
  mainWindow.setAlwaysOnTop(true, 'screen-saver');

  // Priority 1: Ensure window stays visible across all macOS spaces & full-screen apps
  if (process.platform === 'darwin') {
    mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  }

  // Re-assert Always On Top on blur/focus so app switching never demotes z-index
  mainWindow.on('blur', () => {
    if (mainWindow && !mainWindow.isDestroyed() && mainWindow.isVisible()) {
      mainWindow.setAlwaysOnTop(true, 'screen-saver');
    }
  });

  mainWindow.on('focus', () => {
    if (mainWindow && !mainWindow.isDestroyed() && mainWindow.isVisible()) {
      mainWindow.setAlwaysOnTop(true, 'screen-saver');
    }
  });

  // IPC listener for autonomous desktop walking movement
  ipcMain.on('pet-move', (event, { deltaX, deltaY }) => {
    if (!mainWindow || mainWindow.isDestroyed() || !isMovementEnabled) return;
    const [currentX, currentY] = mainWindow.getPosition();
    const newX = Math.max(0, Math.min(screenWidth - winWidth, currentX + (deltaX || 0)));
    const newY = Math.max(0, Math.min(screenHeight - winHeight, currentY + (deltaY || 0)));
    mainWindow.setPosition(newX, newY);
  });

  // IPC listener for dog right-click context menu
  ipcMain.on('pet-context-menu', () => {
    showContextMenu();
  });

  // Active Application Detection Loop (Runs every 4 seconds)
  startActiveAppDetector();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createSystemTray() {
  // Create simple 16x16 status bar / tray icon
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><text y="14" font-size="14">🐶</text></svg>`;
  const iconBuffer = Buffer.from(iconSvg);
  const icon = nativeImage.createFromBuffer(iconBuffer);

  tray = new Tray(icon);
  tray.setToolTip('Namyang Pets — Desktop Companion');

  updateTrayMenu();
}

function updateTrayMenu() {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '🐕 Show Pet',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.setAlwaysOnTop(true, 'screen-saver');
          mainWindow.focus();
        }
      }
    },
    {
      label: '🙈 Hide Pet',
      click: () => {
        if (mainWindow) mainWindow.hide();
      }
    },
    { type: 'separator' },
    {
      label: isMovementEnabled ? '⏸️ Pause Movement' : '▶️ Resume Movement',
      click: () => {
        isMovementEnabled = !isMovementEnabled;
        if (mainWindow) {
          mainWindow.webContents.send('toggle-movement', isMovementEnabled);
        }
        updateTrayMenu();
      }
    },
    { type: 'separator' },
    {
      label: '❌ Quit Namyang Pets',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
}

function showContextMenu() {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '🙈 Hide Pet',
      click: () => {
        if (mainWindow) mainWindow.hide();
      }
    },
    {
      label: isMovementEnabled ? '⏸️ Pause Movement' : '▶️ Resume Movement',
      click: () => {
        isMovementEnabled = !isMovementEnabled;
        if (mainWindow) {
          mainWindow.webContents.send('toggle-movement', isMovementEnabled);
        }
        updateTrayMenu();
      }
    },
    { type: 'separator' },
    {
      label: '❌ Quit Namyang Pets',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  contextMenu.popup();
}

function startActiveAppDetector() {
  setInterval(() => {
    if (!mainWindow || mainWindow.isDestroyed()) return;

    if (process.platform === 'darwin') {
      exec(`osascript -e 'tell application "System Events" to get name of first process whose frontmost is true'`, (err, stdout) => {
        if (!err && stdout) {
          const appName = stdout.trim();
          if (appName && appName !== lastActiveAppName) {
            lastActiveAppName = appName;
            mainWindow.webContents.send('app-context-changed', appName);
          }
        }
      });
    } else if (process.platform === 'win32') {
      exec(`powershell "Get-Process | Where-Only {$_.MainWindowTitle} | Select-Object -First 1 -ExpandProperty ProcessName"`, (err, stdout) => {
        if (!err && stdout) {
          const appName = stdout.trim();
          if (appName && appName !== lastActiveAppName) {
            lastActiveAppName = appName;
            mainWindow.webContents.send('app-context-changed', appName);
          }
        }
      });
    }
  }, 4000);
}

app.whenReady().then(() => {
  createDesktopDogWindow();
  createSystemTray();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createDesktopDogWindow();
  } else {
    mainWindow.show();
  }
});
