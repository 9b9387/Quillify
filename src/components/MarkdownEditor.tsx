import { useState, useEffect } from 'react';
import { useRemirrorContext, Remirror, useRemirror } from '@remirror/react';
import { Box } from '@mui/material';
import ReactMarkdown from 'react-markdown'; // 需要安装 react-markdown
import { MarkdownExtension } from '@remirror/extension-markdown';
import {
    BoldExtension,
    ItalicExtension,
    HeadingExtension,
    LinkExtension,
    BlockquoteExtension,
    CodeBlockExtension,
    CodeExtension,
    HardBreakExtension,
    HorizontalRuleExtension,
    ImageExtension,
    StrikeExtension,
    TableExtension,
    TaskListExtension,
    UnderlineExtension,
} from 'remirror/extensions';
import { BulletListExtension, OrderedListExtension } from '@remirror/extension-list';

import '@remirror/styles/all.css';

function EditorContent() {
    const { setContent } = useRemirrorContext({ autoUpdate: true });

    useEffect(() => {
        const handleFileOpen = (_event: any, data: { content: string; filePath: string }) => {
            setContent(data.content);
        }

        window.ipcRenderer.on('file-opened', handleFileOpen)

        return () => {
            window.ipcRenderer.off('file-opened', handleFileOpen)
        }
    }, [setContent])

    return null;
}

interface EditorProps {
    viewMode: 'preview' | 'split' | 'source';
}

const Editor: React.FC<EditorProps> = ({ viewMode }) => {
    const [content, setContent] = useState('');
    const { manager, state } = useRemirror({
        extensions: () => [
            // Markdown 核心
            new MarkdownExtension({}),
            
            // 文本格式
            new BoldExtension({}),
            new ItalicExtension({}),
            new UnderlineExtension({}),
            new StrikeExtension({}),
            
            // 标题和结构
            new HeadingExtension({}),
            new BulletListExtension({}),
            new OrderedListExtension({}),
            new TaskListExtension({}),
            new BlockquoteExtension({}),
            new HorizontalRuleExtension({}),
            
            // 链接和媒体
            new LinkExtension({
                autoLink: true,
            }),
            new ImageExtension({
                enableResizing: true,
            }),
            
            // 代码
            new CodeExtension({}),
            new CodeBlockExtension({}),
            
            // 表格
            new TableExtension({}),
            
            // 其他
            new HardBreakExtension({}),
        ],
        stringHandler: 'markdown',
        content: ''
    });

    // 更新 handleChange 的类型定义
    const handleChange = ({ helpers }: { helpers: { getMarkdown: () => string } }) => {
        setContent(helpers.getMarkdown());
    };


    const renderEditor = () => (
        <Remirror
            manager={manager}
            initialContent={state}
            autoFocus
            autoRender="end"
            classNames={['remirror-editor', 'markdown-body']}
            onChange={handleChange}
        >
            <EditorContent />
        </Remirror>
    );

    const renderPreview = () => (
        <Box className="markdown-preview" sx={{ p: 2, height: '100%', overflow: 'auto' }}>
            <ReactMarkdown>{content}</ReactMarkdown>
        </Box>
    );

    return (
        <Box sx={{ height: '100%', display: 'flex' }}>
            {viewMode === 'source' && renderEditor()}
            {viewMode === 'preview' && renderPreview()}
            {viewMode === 'split' && (
                <>
                    <Box sx={{ width: '50%', borderRight: 1, borderColor: 'divider' }}>
                        {renderEditor()}
                    </Box>
                    <Box sx={{ width: '50%' }}>
                        {renderPreview()}
                    </Box>
                </>
            )}
        </Box>
    );
};

export default Editor;