import { useState, useEffect } from 'react'
import './App.css'

function App() {
    const [fileContent, setFileContent] = useState<string>('')
    const [filePath, setFilePath] = useState<string>('')

    useEffect(() => {
        const handleFileOpen = (_event: any, data: { content: string; filePath: string }) => {
            setFileContent(data.content)
            setFilePath(data.filePath)
        }

        window.ipcRenderer.on('file-opened', handleFileOpen)

        return () => {
            window.ipcRenderer.off('file-opened', handleFileOpen)
        }
    }, [])

    return (
        <div>
            <h2>文件路径: {filePath || '未选择文件'}</h2>
            <pre>{fileContent || '无内容'}</pre>
        </div>
    )
}

export default App
