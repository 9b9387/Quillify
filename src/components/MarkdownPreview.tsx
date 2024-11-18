import ReactMarkdown from 'react-markdown';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const MarkdownPreview: React.FC = () => {
    const content = useSelector((state: RootState) => state.file.content);

    return (
        <Box
            className="markdown-preview"
            sx={{
                p: 2,
                height: '100%',
                overflowY: 'auto', // 允许纵向滚动
                overflowX: 'hidden', // 隐藏横向滚动条
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
            }}
        >
            <ReactMarkdown>{content}</ReactMarkdown>
        </Box>
    );
};

export default MarkdownPreview;