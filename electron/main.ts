import { app, BrowserWindow } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import FileService from './services/file-service'

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
let fileService: FileService | null = null;
let fileToOpen: string | null = null;

app.on('will-finish-launching', () => {
    // 处理通过 Finder 打开文件的事件
    app.on('open-file', (event, filePath) => {
        event.preventDefault();
        console.log('Open file triggered:', filePath);
        fileToOpen = filePath;
    });
});

function createWindow() {
    win = new BrowserWindow({
        width: 900,
        height: 670,
        frame: false,
        icon: path.join(process.env.VITE_PUBLIC, 'icon.png'),
        titleBarStyle: 'hiddenInset',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.mjs'),
            webSecurity: false
        },
        trafficLightPosition: { x: 10, y: 10 },
        show: false,  // 先不显示窗口
    })

    // 监听窗口关闭事件
    win.on('closed', () => {
        console.log('Window closed')
        win = null  // 重要：窗口关闭时设置为 null
    })

    // 窗口准备好时显示
    win.once('ready-to-show', () => {
        win?.show()
        win?.focus()
    })

    if (!fileService) {
        fileService = new FileService(win);
        fileService.registerIpcHandlers();
    } else {
        fileService.updateWindow(win);
    }

    // 添加窗口加载完成的处理
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', 'window-loaded')
        fileToOpen = "/Users/shihongyang/Projects/Quillify/README.md"
        if (fileToOpen) {
            fileService!.openFileByPath(fileToOpen).then((result) => {
                console.log('Open file result:', result);
                win?.webContents.send('file-opened', result)

            });
            fileToOpen = null;
        }
    })

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL)
    } else {
        win.loadFile(path.join(RENDERER_DIST, 'index.html'))
    }




}

// 修改 window-all-closed 事件处理
app.on('window-all-closed', () => {
    console.log('All windows closed')
    win = null  // 确保设置为 null
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// 修改 activate 事件处理
app.on('activate', () => {
    console.log('App activated')
    if (!win || win.isDestroyed()) {  // 检查窗口是否存在或已销毁
        createWindow()
    } else {
        win.show()
    }
})

app.whenReady().then(() => {
    createWindow();
    
    // 确保窗口成为活动窗口
    if (process.platform === 'darwin') {
        app.dock.show();  // macOS 上显示 dock 图标
    }
    
    // 将应用程序带到前台
    app.focus({ steal: true });
});

if (process.platform === 'darwin') {
    app.dock.setIcon(path.join(process.env.VITE_PUBLIC, 'icon.png'))
}