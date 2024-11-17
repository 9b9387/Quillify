import { useMemo, useState } from 'react';

import { Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';

import Editor from "./components/MarkdownEditor";
import TitleBar from "./components/TitleBar";
import TextEditor from "./components/TextEditor";

function App() {
    const [viewMode, setViewMode] = useState<'preview' | 'split' | 'source'>('source');
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = useMemo(() =>
        createTheme({
            palette: {
                mode: prefersDarkMode ? 'dark' : 'light',
            },
        }),
        [prefersDarkMode],
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <TitleBar viewMode={viewMode} setViewMode={setViewMode} />
                {/* <Box sx={{ flex: 1, overflow: 'hidden' }}>
                    <Editor viewMode={viewMode} />
                </Box> */}

                <TextEditor />
            </Box>
        </ThemeProvider>
    );
}

export default App;