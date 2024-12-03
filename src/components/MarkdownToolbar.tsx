import { Box, IconButton, Tooltip, Divider } from '@mui/material';
import {
    FormatBold,
    FormatItalic,
    FormatListBulleted,
    FormatListNumbered,
    Code,
    Link,
    Image,
    FormatQuote,
    TableChart,
    CheckBox
} from '@mui/icons-material';
import { EditorView } from '@codemirror/view';

interface MarkdownToolbarProps {
    editor: EditorView | null;
}

const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({ editor }) => {
    const insertMarkdown = (before: string, after: string = '') => {
        if (!editor) return;
        
        const selection = editor.state.selection.main;
        const selectedText = editor.state.sliceDoc(selection.from, selection.to);
        
        editor.dispatch({
            changes: {
                from: selection.from,
                to: selection.to,
                insert: `${before}${selectedText}${after}`
            },
            selection: { 
                anchor: selection.from + before.length,
                head: selection.from + before.length + selectedText.length 
            }
        });
        editor.focus();
    };

    const tools = [
        {
            icon: <FormatBold />,
            tooltip: '粗体 (Ctrl+B)',
            onClick: () => insertMarkdown('**', '**')
        },
        {
            icon: <FormatItalic />,
            tooltip: '斜体 (Ctrl+I)',
            onClick: () => insertMarkdown('*', '*')
        },
        { type: 'divider' },
        {
            icon: <FormatListBulleted />,
            tooltip: '无序列表',
            onClick: () => insertMarkdown('- ')
        },
        {
            icon: <FormatListNumbered />,
            tooltip: '有序列表',
            onClick: () => insertMarkdown('1. ')
        },
        {
            icon: <CheckBox />,
            tooltip: '任务列表',
            onClick: () => insertMarkdown('- [ ] ')
        },
        { type: 'divider' },
        {
            icon: <Code />,
            tooltip: '代码块',
            onClick: () => insertMarkdown('```\n', '\n```')
        },
        {
            icon: <FormatQuote />,
            tooltip: '引用',
            onClick: () => insertMarkdown('> ')
        },
        { type: 'divider' },
        {
            icon: <Link />,
            tooltip: '链接',
            onClick: () => insertMarkdown('[', '](url)')
        },
        {
            icon: <Image />,
            tooltip: '图片',
            onClick: () => insertMarkdown('![', '](url)')
        },
        {
            icon: <TableChart />,
            tooltip: '表格',
            onClick: () => insertMarkdown(
                '| Column 1 | Column 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |'
            )
        }
    ];

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '2px 4px',  // 减小内边距
                minHeight: '40px',   // 固定高度
                maxHeight: '40px',   // 限制最大高度
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                overflow: 'hidden'   // 防止内容溢出
            }}
        >
            {tools.map((tool, index) => 
                tool.type === 'divider' ? (
                    <Divider 
                        orientation="vertical" 
                        flexItem 
                        sx={{ 
                            mx: 0.5,
                            height: '20px',  // 调整分隔符高度
                            my: 'auto'       // 垂直居中
                        }} 
                        key={`divider-${index}`} 
                    />
                ) : (
                    <Tooltip title={tool.tooltip} key={tool.tooltip}>
                        <IconButton
                            size="small"
                            onClick={tool.onClick}
                            sx={{ 
                                mx: 0.25,    // 减小按钮间距
                                p: '4px',    // 减小按钮内边距
                                '& svg': {    // 调整图标大小
                                    fontSize: '1.2rem'
                                },
                                '&:hover': {
                                    bgcolor: 'action.hover'
                                }
                            }}
                        >
                            {tool.icon}
                        </IconButton>
                    </Tooltip>
                )
            )}
        </Box>
    );
};

export default MarkdownToolbar; 