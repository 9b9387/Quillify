import { app, BrowserWindow } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function handleFileOpen(filePath: string) {
    if (!filePath) return

    try {
        const content = fs.readFileSync(filePath, 'utf-8')
        console.log('Reading file:', filePath)

        if (!win) {
            createWindow()
        }
        else {
            win.show()
            win.moveTop()
            win.focus()
        }

        // 等待窗口加载完成后发送事件
        const sendContent = () => {
            console.log('Sending content to renderer')
            win?.webContents.send('file-opened', { content, filePath })
        }

        if (win?.webContents.isLoading()) {
            win.webContents.once('did-finish-load', sendContent)
        } else {
            sendContent()
        }

    } catch (error) {
        console.error('Error reading file:', error)
    }
}

let fileToOpen: string | null = null;

app.on('will-finish-launching', () => {
    // 处理通过 Finder 打开文件的事件
    app.on('open-file', (event, filePath) => {
        event.preventDefault();
        console.log('Open file triggered:', filePath);
        
        if (app.isReady()) {
            // 如果应用已经准备好，直接打开文件
            handleFileOpen(filePath);
        } else {
            // 如果应用还没准备好，存储文件路径
            fileToOpen = filePath;
        }
    });
});

function createWindow() {
    win = new BrowserWindow({
        width: 900,
        height: 670,
        icon: path.join(process.env.VITE_PUBLIC, 'icon.png'), // 窗口图标
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.mjs'),
            webSecurity: false  // 在开发时可以设置为 false 以便调试
        },
    })

    // 添加窗口加载完成的处理
    win.webContents.on('did-finish-load', () => {
        console.log('Window loaded')
        win?.webContents.send('main-process-message', 'window-loaded')
    })

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL)
    } else {
        win.loadFile(path.join(RENDERER_DIST, 'index.html'))
    }

    // test code!
    // handleFileOpen("")
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
        win = null
    }
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.whenReady().then(() => {
    createWindow();
    
    // 如果有待打开的文件，现在打开它
    if (fileToOpen) {
        handleFileOpen(fileToOpen);
        fileToOpen = null;
    }
});

if (process.platform === 'darwin') {
    app.dock.setIcon(path.join(process.env.VITE_PUBLIC, 'icon.png'))
}

// 添加命令行参数的处理
if (process.argv.length >= 2) {
    const filePath = process.argv[1];
    if (filePath && !filePath.startsWith('-')) {
        // 检查是否是有效的文件路径
        if (fs.existsSync(filePath)) {
            if (app.isReady()) {
                handleFileOpen(filePath);
            } else {
                fileToOpen = filePath;
            }
        }
    }
}