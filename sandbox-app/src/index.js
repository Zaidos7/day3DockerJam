const { app, BrowserWindow, ipcMain } = require("electron");
const { ChildProcess, exec } = require("node:child_process");
const path = require("node:path");
const { cwd } = require("node:process");

// get sandbox path
const sandboxDir = path.resolve(__dirname, "..", "..", "sandbox");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

// function to execute the docker commands when pressing a button
// witj error handling
function execCmd(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, options, (err, stdout, stderr) => {
      if (err) return reject({ error: err.message, stdout, stderr });
      resolve({ stdout, stderr });
    });
  });
}

ipcMain.handle("start", async () => {
  return execCmd("docker compose up -d --build", { cwd: sandboxDir });
});

ipcMain.handle("stop", async () => {
  return execCmd("docker compose down -v", { cwd: sandboxDir });
});

// return logs as string
ipcMain.handle("logs", async () => {
  const result = await execCmd("docker compose logs --no-color --tail=500", {
    cwd: sandboxDir,
  });
  return (
    (result.stdout || "") +
    (result.stderr ? "\n[stderr]\n" + result.stderr : "")
  );
});

ipcMain.handle("network", async () => {
  const result = await execCmd(
    "docker network inspect sandbox-net 2>/dev/null || docker network ls --filter name=sandbox",
    {
      cwd: sandboxDir,
    }
  );
  return (
    (result.stdout || "") +
    (result.stderr ? "\n[stderr]\n" + result.stderr : "")
  );
});

// run reset script in sandbox directory
ipcMain.handle("reset", async () => {
  try {
    return await execCmd("bash scripts/reset2.sh", { cwd: sandboxDir });
  } catch (err) {
    return err;
  }
});

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
