import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { languages } from '@codemirror/language-data';

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
            whiteSpace: 'pre-wrap',  // 确保长行会换行
            padding: '10px',
            maxWidth: '100%',        // 确保内容不会超出容器
            wordWrap: 'break-word',  // 确保长单词会换行
            overflowWrap: 'break-word'
        },
        '.cm-line': {
            maxWidth: '100%',        // 确保每行不会超出容器
            wordWrap: 'break-word'
        }
    });

    return (
        <Box sx={{ 
            width: '100%', 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            '& .cm-editor': {
                height: '100%',
                flex: 1,
                maxWidth: '100%',    // 确保编辑器不会超出容器
                overflow: 'auto'      // 添加滚动条
            },
            '& .cm-scroller': {
                maxWidth: '100%'     // 确保滚动区域不会超出容器
            }
        }}>
            <CodeMirror
                value={content}
                onChange={(value) => setContent(value)}
                height="100%"
                width="100%"         // 设置宽度为100%
                theme={theme}
                extensions={[
                    markdown({
                        base: markdownLanguage,
                        codeLanguages: languages,  // 支持代码块语法高亮
                        addKeymap: true  // 添加 Markdown 快捷键
                    }),
                    syntaxHighlighting(defaultHighlightStyle),
                ]}
                basicSetup={{
                    lineNumbers: false,      // 不显示行号
                    foldGutter: false,       // 不显示折叠图标
                    dropCursor: true,        // 显示拖放指示器
                    allowMultipleSelections: true,
                    indentOnInput: true,    // 启用自动缩进
                    highlightActiveLine: false, // 不高亮当前行
                    highlightSelectionMatches: false, // 不高亮匹配选择
                    closeBrackets: true,    // 启用自动闭合括号
                    autocompletion: false,   // 禁用自动完成
                    rectangularSelection: true, // 启用矩形选择
                    crosshairCursor: false,  // 禁用十字光标
                }}
            />
        </Box>
    );
};

export default TextEditor;