import { Box } from '@mui/material';

import TextEditor from './TextEditor';
import MarkdownPreview from './MarkdownPreview';

interface EditorProps {
    viewMode: 'preview' | 'split' | 'source';
}

const MarkdownEditor: React.FC<EditorProps> = ({ viewMode }) => {

    const renderEditor = () => (
        <TextEditor />
    );

    const renderPreview = () => (
        <MarkdownPreview />
    );

    return (
        <Box sx={{ height: '100%', display: 'flex' }}>
            {viewMode === 'source' && renderEditor()}
            {viewMode === 'preview' && renderPreview()}
            {viewMode === 'split' && (
                <>
                    <Box sx={{ width: '50%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        {renderEditor()}
                    </Box>
                    <Box sx={{ width: '50%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        {renderPreview()}
                    </Box>
                </>
            )}
        </Box>
    );
};

export default MarkdownEditor;