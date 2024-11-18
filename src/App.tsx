import { useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import store from './store';
import { Provider } from 'react-redux';
import Layout from './components/Layout';
import TitleBar from "./components/TitleBar";
import MarkdownEditor from "./components/MarkdownEditor";

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
            <Provider store={store}>
            <Layout 
                header={
                    <TitleBar viewMode={viewMode} setViewMode={setViewMode} />
                }
                content={
                    <MarkdownEditor viewMode={viewMode} />
                }
                // 示例：如果需要侧边栏
                // sidebar={<SideBar />}
                // 示例：如果需要底部状态栏
                // footer={<StatusBar />}
            />
            </Provider>
        </ThemeProvider>
    );
}

export default App;