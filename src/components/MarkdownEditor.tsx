import React, { useRef, useCallback, useEffect, useState } from 'react';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { EditorView, ViewUpdate } from '@codemirror/view';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import MarkdownPreview from '@uiw/react-markdown-preview';
import * as events from '@uiw/codemirror-extensions-events';
import { Box } from '@mui/material';
import { RootState } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { updateContent } from '../store/fileSlice';
import { search } from '@codemirror/search';
import { SearchPanel } from './SearchPanel';
import { createRoot } from 'react-dom/client';

interface MDEditorProps {
    value?: string;
    onChange?: (value: string, viewUpdate: ViewUpdate) => void;
}

interface MDEditorRef {
    editor: React.RefObject<ReactCodeMirrorRef>;
    preview: React.RefObject<HTMLDivElement> | null;
}

const MarkdownEditor = React.forwardRef<MDEditorRef, MDEditorProps>((props, ref) => {
    const {
        onChange,
    } = props;

    const codeMirror = useRef<ReactCodeMirrorRef>(null);
    const preview = useRef<HTMLDivElement>(null);
    const active = useRef<'editor' | 'preview'>('editor');
    const viewMode = useSelector((state: RootState) => state.view.mode);

    // 处理滚动同步
    const handleScroll = useCallback(
        (event: Event) => {
            const target = event.target as HTMLDivElement;
            const percent = target.scrollTop / target.scrollHeight;
            
            if (active.current === 'editor' && preview.current) {
                const previewHeight = preview.current.scrollHeight || 0;
                preview.current.scrollTop = previewHeight * percent;
            } else if (codeMirror.current && codeMirror.current.view) {
                const editorScrollDom = codeMirror.current.view.scrollDOM;
                const editorScrollHeight = editorScrollDom.scrollHeight || 0;
                editorScrollDom.scrollTop = editorScrollHeight * percent;
            }
        },[]);

    // 鼠标事件处理
    const handleMouseOver = () => (active.current = 'preview');
    const handleMouseLeave = () => (active.current = 'editor');

    // 设置滚动监听
    useEffect(() => {
        const $preview = preview.current;
        if ($preview) {
            $preview.addEventListener('mouseover', handleMouseOver);
            $preview.addEventListener('mouseleave', handleMouseLeave);
            $preview.addEventListener('scroll', handleScroll);

            return () => {
                $preview.removeEventListener('mouseover', handleMouseOver);
                $preview.removeEventListener('mouseleave', handleMouseLeave);
                $preview.removeEventListener('scroll', handleScroll);
            };
        }
    }, [handleScroll]);

    const containerRef = useRef(null);
    const [editorHeight, setEditorHeight] = useState('100%'); // 默认值

    useEffect(() => {
        const updateHeight = () => {
            const container = containerRef.current;
            if (container) {
                setEditorHeight(`${(container as HTMLElement).offsetHeight}px`);
            }
        };

        updateHeight(); // 初次计算高度
        window.addEventListener('resize', updateHeight); // 监听窗口变化
        return () => window.removeEventListener('resize', updateHeight); // 清理事件监听
    }, []);

    const content = useSelector((state: RootState) => state.file.content);
    const dispatch = useDispatch();


    // 编辑器扩展
    const extensions = [
        markdown({
            base: markdownLanguage, 
            codeLanguages: languages,
        }),
        events.scroll({ scroll: handleScroll }),
        EditorView.lineWrapping,
        search({
            top: true,           // 搜索框显示在顶部
            caseSensitive: false, // 默认不区分大小写
            literal: false,       // 默认不使用文字匹配
            wholeWord: false,     // 默认不使用全词匹配
            createPanel: (view: EditorView) => {
                const dom = document.createElement("div");
                let root: ReturnType<typeof createRoot> | null = null;
                
                return {
                    dom,
                    mount: () => {
                        root = createRoot(dom);
                        root.render(<SearchPanel view={view} />);
                    },
                    destroy: () => {
                        root?.unmount();
                        root = null;
                    }
                };
            }
        })
    ];

    // 内容变化处理
    const handleChange = (value: string, viewUpdate: ViewUpdate) => {
        dispatch(updateContent({ content: value }));
        onChange?.(value, viewUpdate);
    };

    // 暴露 ref
    React.useImperativeHandle(ref, () => ({
        editor: codeMirror,
        preview: preview
    }));

    return (
        <Box 
            ref={containerRef}
            sx={{ 
                display: 'flex',
                height: '100%',
                overflow: 'hidden'
        }}>
            <Box sx={{ 
                flex: 1,
                overflow: 'hidden',
                display: viewMode === 'preview' ? 'none' : 'block',
                width: viewMode === 'split' ? '50%' : '100%'
            }}>
                <CodeMirror
                    value={content}
                    height={editorHeight}
                    basicSetup={{
                        lineNumbers: false,
                        foldGutter: false,
                        dropCursor: true,
                        allowMultipleSelections: true,
                        indentOnInput: true,
                        closeBrackets: true,
                        tabSize: 4,
                        autocompletion: true,
                        closeBracketsKeymap: true
                    }}
                    extensions={extensions}
                    onChange={handleChange}
                    ref={codeMirror}
                />
            </Box>
            <Box 
                ref={preview}
                sx={{ 
                    flex: 1,
                    overflow: 'auto',
                    borderLeft: viewMode === 'split' ? 1 : 0,
                    borderColor: 'divider',
                    p: 2,
                    display: viewMode === 'source' ? 'none' : 'block',
                    width: viewMode === 'split' ? '50%' : '100%'
                }}
            >
                <MarkdownPreview source={content} />
            </Box>
        </Box>
    );
});

export default MarkdownEditor;
