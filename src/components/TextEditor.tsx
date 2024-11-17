import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';

const TextEditor = () => {
    const [content, setContent] = useState('');

    useEffect(() => {
        const handleFileOpen = (_event: any, data: { content: string; filePath: string }) => {
            console.log('handleFileOpen', data.filePath);
            setContent(data.content);
        }

        window.ipcRenderer.on('file-opened', handleFileOpen);

        return () => {
            window.ipcRenderer.off('file-opened', handleFileOpen);
        }
    }, []);

    // 编辑器主题配置
    const theme = EditorView.theme({
        '&': {
            height: '100%',
            fontSize: '14px'
        },
        '.cm-scroller': {
            fontFamily: 'monospace',
            lineHeight: '1.5'
        },
        '.cm-content': {
            whiteSpace: 'pre-wrap',
            padding: '10px'
        }
    });

    return (
        <Box sx={{ 
            width: '100%', 
            height: '100%',
            '& .cm-editor': {
                height: '100%'
            }
        }}>
            <CodeMirror
                value={content}
                onChange={(value) => setContent(value)}
                height="100%"
                theme={theme}
                basicSetup={{
                    lineNumbers: false,      // 不显示行号
                    foldGutter: false,       // 不显示折叠图标
                    dropCursor: true,        // 显示拖放指示器
                    allowMultipleSelections: true,
                    indentOnInput: false,    // 禁用自动缩进
                    highlightActiveLine: false, // 不高亮当前行
                    highlightSelectionMatches: false, // 不高亮匹配选择
                    closeBrackets: false,    // 禁用自动闭合括号
                    autocompletion: false,   // 禁用自动完成
                    rectangularSelection: true, // 启用矩形选择
                    crosshairCursor: false,  // 禁用十字光标
                }}
            />
        </Box>
    );
};

export default TextEditor;