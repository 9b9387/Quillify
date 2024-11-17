import { useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';

import Layout from './components/Layout';
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
            <Layout 
                header={
                    <TitleBar viewMode={viewMode} setViewMode={setViewMode} />
                }
                content={
                    <TextEditor />
                }
                // 示例：如果需要侧边栏
                // sidebar={<SideBar />}
                // 示例：如果需要底部状态栏
                // footer={<StatusBar />}
            />
        </ThemeProvider>
    );
}

export default App;