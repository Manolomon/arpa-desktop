import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as url from "url";
import * as fs from "fs";

let mainWindow: BrowserWindow;

app.on("ready", createWindow);

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});

function createWindow() {

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 200,
        minHeight: 150,
        icon: path.join(__dirname, '/../../src/assets/icons/png/128x128.png'),
        webPreferences: {
            nodeIntegration: false,
            nodeIntegrationInWorker: false,
            contextIsolation: false,
            preload: './preload.js'
        }
    })

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, '/../../dist/arpa-desktop/index.html'),
            protocol: "file:",
            slashes: true
        })
    );

    //mainWindow.webContents.openDevTools();

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

ipcMain.on("getFiles", (event, arg) => {
    const files = fs.readdirSync(__dirname);
    mainWindow.webContents.send("getFilesResponse", files);
});