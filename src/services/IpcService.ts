// 定义接收到的文件数据类型
interface FileData {
    content: string;
    filePath: string;
}

// 定义事件处理器类型
type IpcEventHandler<T = any> = (data: T) => void;

class IpcService {
    private static instance: IpcService;
    private handlers: Map<string, Set<IpcEventHandler>>;

    private constructor() {
        this.handlers = new Map();
        this.initializeListeners();
    }

    public static getInstance(): IpcService {
        if (!IpcService.instance) {
            IpcService.instance = new IpcService();
        }
        return IpcService.instance;
    }

    private initializeListeners() {
        // 监听文件打开事件
        window.ipcRenderer.on('file-opened', (_event, data: FileData) => {
            console.log('IPC: Received file-opened event', {
                filePath: data.filePath,
                contentLength: data.content.length
            });
            this.emit('file-opened', data);
        });

        // 可以添加其他 IPC 事件监听
    }

    public on<T>(event: string, handler: IpcEventHandler<T>) {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }
        this.handlers.get(event)?.add(handler);

        // 返回清理函数
        return () => {
            this.handlers.get(event)?.delete(handler);
        };
    }

    private emit(event: string, data: any) {
        this.handlers.get(event)?.forEach(handler => {
            try {
                handler(data);
            } catch (error) {
                console.error(`Error in ${event} handler:`, error);
            }
        });
    }
}

export default IpcService; 