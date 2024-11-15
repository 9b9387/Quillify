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
        // 添加文件检查
        const stats = fs.statSync(filePath)
        if (!stats.isFile()) {
            console.log('Not a file:', filePath)
            return
        }

        const content = fs.readFileSync(filePath, 'utf-8')
        console.log('Reading file:', filePath)

        // 如果窗口不存在或已销毁，创建新窗口
        if (!win || win.isDestroyed()) {
            console.log('Creating new window...')
            createWindow()
            
            // 等待窗口创建完成后再发送内容
            win?.once('ready-to-show', () => {
                sendContentToWindow(content, filePath)
            })
        } else {
            console.log('Using existing window...')
            win.show()
            win.moveTop()
            win.focus()
            sendContentToWindow(content, filePath)
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

    // 添加窗口加载完成的处理
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', 'window-loaded')
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

// 添加发送内容的辅助函数
function sendContentToWindow(content: string, filePath: string) {
    if (!win || win.isDestroyed()) return

    const sendContent = () => {
        console.log('Sending content to renderer')
        win?.webContents.send('file-opened', { content, filePath })
    }

    if (win.webContents.isLoading()) {
        win.webContents.once('did-finish-load', sendContent)
    } else {
        sendContent()
    }
}