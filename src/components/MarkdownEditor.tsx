import { useEffect } from 'react';
import { useRemirrorContext, Remirror, useRemirror } from '@remirror/react';
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

const Editor: React.FC = () => {
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

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <Remirror
                manager={manager}
                initialContent={state}
                autoFocus
                autoRender="end"
                classNames={[
                    'remirror-editor',
                    'markdown-body'
                ]}
            >
                <EditorContent />
            </Remirror>
        </div>
    );
};

export default Editor;