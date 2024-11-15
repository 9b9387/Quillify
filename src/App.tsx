import { Box } from '@mui/material';
import Editor from "./components/MarkdownEditor";
import TitleBar from "./components/TitleBar";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo, useState } from 'react';

// 导入 Inter 字体
import '@fontsource/inter/300.css';  // light
import '@fontsource/inter/400.css';  // regular
import '@fontsource/inter/500.css';  // medium
import '@fontsource/inter/600.css';  // semibold
import '@fontsource/inter/700.css';  // bold

function App() {
    const [viewMode, setViewMode] = useState<'preview' | 'split' | 'source'>('source');
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = useMemo(
        () =>
            createTheme({
                typography: {
                    fontFamily: [
                        'Inter',
                        '-apple-system',
                        'BlinkMacSystemFont',
                        '"Segoe UI"',
                        'Roboto',
                        'sans-serif',
                    ].join(','),
                },
                palette: {
                    mode: prefersDarkMode ? 'dark' : 'light',
                },
                components: {
                    // 添加全局样式覆盖
                    MuiCssBaseline: {
                        styleOverrides: {
                            '*': {
                                outline: 'none !important',
                                '&:focus': {
                                    outline: 'none !important'
                                },
                                '&:focus-visible': {
                                    outline: 'none !important'
                                }
                            },
                            '.MuiButtonBase-root': {
                                '&:focus-visible': {
                                    outline: 'none !important',
                                    boxShadow: 'none !important'
                                }
                            }
                        }
                    }
                }
            }),
        [prefersDarkMode],
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <TitleBar viewMode={viewMode} setViewMode={setViewMode} />
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                    <Editor viewMode={viewMode} />
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default App;
