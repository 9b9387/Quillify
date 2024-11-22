import { useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import store from './store';
import { Provider } from 'react-redux';
import TitleBar from "./components/TitleBar";
import AppLayout from './components/AppLayout';
import { Box } from '@mui/material';
import MarkdownEditor from './components/MarkdownEditor';
import IpcService from './services/IpcService';
import { openFile } from './store/fileSlice';

function App() {
    const ipcService = IpcService.getInstance();
    ipcService.on('file-opened', (data: { content: string, filePath: string }) => {
        console.log('App received file-opened event', data);
        store.dispatch(openFile(data));
    });

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
            <AppLayout 
                header={<TitleBar />}
                content={<MarkdownEditor />}
                footer={<Box sx={{ flexShrink: 0, height: "24px" }} />}
            />
            </Provider>
        </ThemeProvider>
    );
}

export default App;