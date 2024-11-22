import { dialog, BrowserWindow, ipcMain } from 'electron';
import fs from 'fs';

interface FileServiceResult {
    success: boolean;
    content?: string;
    filePath?: string;
    error?: Error;
}

interface UserActionResult {
    actionType: 'save' | 'discard' | 'cancel';
}

export default class FileService {
    private win: BrowserWindow;

    constructor(window: BrowserWindow) {
        this.win = window;
    }

    updateWindow(window: BrowserWindow) {
        this.win = window;
    }

    registerIpcHandlers() {
        console.log("FileService registerIpcHandlers");
        ipcMain.handle('file:open', async () => {
            console.log("FileService file:open");
            return await this.openFile();
        });

        ipcMain.handle('file:save', async (_, { filePath, content }) => {
            return await this.saveFile(filePath, content);
        });

        ipcMain.handle('file:new', async () => {
            return await this.newFile();
        });

        ipcMain.handle('file:confirm-level', async () => {
            return await this.showLevelConfirmDialog();
        });
    }

    async showLevelConfirmDialog(): Promise<UserActionResult> {
        const { response } = await dialog.showMessageBox(this.win, {
            type: 'question',
            buttons: ['保存', '不保存', '取消'],
            message: '是否保存当前的变更?',
            defaultId: 0,
            title: '保存变更'
        });
        return { actionType: response === 0 ? 'save' : response === 1 ? 'discard' : 'cancel' };
    }

    async openFile(): Promise<FileServiceResult> {
        try {
            const { canceled, filePaths } = await dialog.showOpenDialog(this.win, {
                properties: ['openFile'],
                filters: [
                    { name: 'Markdown', extensions: ['md', 'markdown', 'mdown', 'mkd'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });

            if (canceled || filePaths.length === 0) {
                return { success: false };
            }

            const filePath = filePaths[0];
            return await this.openFileByPath(filePath); 
        } catch (error) {
            return {
                success: false,
                error: error as Error
            };
        }
    }

    async openFileByPath(filePath: string): Promise<FileServiceResult> {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            return {
                success: true,
                content,
                filePath
            };
        } catch (error) {
            return {
                success: false,
                error: error as Error
            };
        }
    }

    // 可以添加其他文件操作方法
    async saveFile(path: string, content: string): Promise<FileServiceResult> {

        if(path === '' || path === null) {
            const { canceled, filePath } = await dialog.showSaveDialog(this.win, {
                filters: [
                    { name: 'Markdown', extensions: ['md', 'markdown', 'mdown', 'mkd'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });

            if (canceled || !filePath) {
                return { success: false };
            }

            path = filePath;
        }

        try {
            fs.writeFileSync(path, content, 'utf-8');
            return { success: true, filePath: path };
        } catch (error) {
            console.error('Error saving file:', error);
            return {
                success: false,
                error: error as Error
            };
        }
    }

    async newFile(): Promise<FileServiceResult> {

        return {
            success: true,
            content: '',
            filePath: ''
        };
    }
}