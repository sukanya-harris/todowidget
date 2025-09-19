const { app, BrowserWindow, Tray, Menu, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

let tray;
let mainWindow;
const saveFile = path.join(app.getPath('userData'), 'tasks.json');

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 600,
        frame: false, //no title bar
        resizable: true,
        transparent: true,
        icon: path.join(__dirname, 'resources', 'icon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    
    mainWindow.loadFile("index.html");

    mainWindow.on("close", (event) => {
        event.preventDefault();
        mainWindow.hide();
    });
}

app.on("ready", () => {
    createWindow();

    tray = new Tray(path.join(__dirname, 'resources', 'icon.png'));
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Show', click: () => mainWindow.show() },
        { label: 'Exit', click: () => { app.isQuiting = true; app.quit(); } }
    ]);
    tray.setToolTip('To-Do Widget');
    tray.setContextMenu(contextMenu);

    tray.on('double-click', () => mainWindow.show());
});


ipcMain.on("resize-window", (event, newHeight) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
        win.setBounds({
            x: win.getBounds().x,
            y: win.getBounds().y,
            width: win.getBounds().width,
            height: newHeight + 40 // add a little padding
        });
    }
});



app.on("window-all-closed", (event) => {
    if (process.platform !== "darwin") app.quit();
    event.preventDefault();
});