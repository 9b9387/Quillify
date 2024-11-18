import { AppBar, Toolbar, Typography, ButtonGroup, Button, IconButton, Theme } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { Visibility, VerticalSplit, Code, NoteAdd, FileOpen, Save } from '@mui/icons-material';
import { openFile, saveFile } from '../store/fileSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';

const StyledAppBar = styled(AppBar)({
    WebkitAppRegion: 'drag',
    backgroundColor: 'transparent',
    boxShadow: 'none',
});

const TitleToolbar = styled(Toolbar)({
    minHeight: '38px !important',
    padding: '0 10px 2px 10px !important',
    paddingLeft: '80px !important',
});

const ActionToolbar = styled(Toolbar)({
    minHeight: '30px !important',
    padding: '0 16px !important',
    borderBottom: '1px solid',
    borderColor: 'rgba(0, 0, 0, 0.12)',
});

const buttonStyles = (theme: Theme) => ({
    transition: 'background-color 0.3s',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    color: theme.palette.mode === 'light' ? theme.palette.text.primary : theme.palette.common.white,
    '& .MuiSvgIcon-root': {
        color: theme.palette.mode === 'light' ? theme.palette.text.primary : theme.palette.common.white,
    }
});

interface TitleBarProps {
    viewMode: 'preview' | 'split' | 'source';
    setViewMode: React.Dispatch<React.SetStateAction<'preview' | 'split' | 'source'>>;
}

const TitleBar: React.FC<TitleBarProps> = ({ viewMode, setViewMode }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const {filePath, content, isModified} = useSelector((state: RootState) => state.file);


    const confirmLevel = async ({onSave, onDiscard, onCancel}: {onSave: () => void, onDiscard: () => void, onCancel: () => void}) => {
        const result = await window.ipcRenderer.invoke('file:confirm-level');
        const type = result.actionType;

        if (type === 'discard') {
            onDiscard();
        }
        else if (type === 'save') {
            onSave();
        }
        else {
            onCancel();
        }
    }   

    const onClickNewFile = async () => {
        console.log("New File Clicked");
        if (isModified) {
            await confirmLevel({
                onSave: async () => {
                    await handleSaveFile();
                    await handleNewFile();
                }, 
                onDiscard: async () => {
                    await handleNewFile();
                }, 
                onCancel: () => {}
            });
        }
        else
        {
            await handleNewFile();
        }
    }
    const handleNewFile = async () => {
        const result = await window.ipcRenderer.invoke('file:new');
        if (result.success) {
            dispatch(openFile({ content: result.content, filePath: result.filePath }));
        }
    };

    const onClickOpenFile = async () => {
        console.log("Open File Clicked");
        if (isModified) {
            await confirmLevel({
                onSave: async () => {
                    await handleSaveFile();
                    await handleOpenFile();
                }, 
                onDiscard: async () => {
                    await handleOpenFile();
                }, 
                onCancel: () => {}
            });        }
        else {
            await handleOpenFile();
        }
    }

    const handleOpenFile = async () => {
        const result = await window.ipcRenderer.invoke('file:open');
        if (result.success) {
            dispatch(openFile({ content: result.content, filePath: result.filePath }));
        }
    };

    const handleSaveFile = async () => {
        console.log("Save File Clicked");

        const result = await window.ipcRenderer.invoke('file:save', { filePath, content });
        if (result.success) {
            dispatch(saveFile());
        }
    };

    return (
        <StyledAppBar position="static">
            <TitleToolbar>
                <Typography
                    variant="subtitle1"
                    component="div"
                    sx={{
                        flexGrow: 1,
                        textAlign: 'left',
                        color: 'text.primary',
                        fontSize: '14px',
                        fontWeight: 700
                    }}
                >
                    Quillify {filePath ? `- ${filePath}` : '- Untitled'} {isModified ? ' *' : ''}
                </Typography>
                <ButtonGroup 
                    variant="outlined" 
                    size="small" 
                    sx={{ 
                        WebkitAppRegion: 'no-drag',
                        '& .MuiButton-root': {
                            height: '18px',
                            minHeight: '18px',
                            padding: '0 8px',
                            minWidth: '38px',
                            ...buttonStyles(theme)
                        },
                        '& .MuiSvgIcon-root': {
                            fontSize: '16px'
                        }
                    }}
                >
                    <Button 
                        onClick={() => setViewMode('preview')}
                        variant={viewMode === 'preview' ? 'contained' : 'outlined'}
                    >
                        <Visibility fontSize="small" />
                    </Button>
                    <Button 
                        onClick={() => setViewMode('split')}
                        variant={viewMode === 'split' ? 'contained' : 'outlined'}
                    >
                        <VerticalSplit fontSize="small" />
                    </Button>
                    <Button 
                        onClick={() => setViewMode('source')}
                        variant={viewMode === 'source' ? 'contained' : 'outlined'}
                    >
                        <Code fontSize="small" />
                    </Button>
                </ButtonGroup>
            </TitleToolbar>

            <ActionToolbar>
                <ButtonGroup sx={{ 
                        WebkitAppRegion: 'no-drag'
                    }}>
                    <IconButton size="small" color="inherit" onClick={onClickNewFile} sx={buttonStyles(theme)}>
                        <NoteAdd fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="inherit" onClick={onClickOpenFile} sx={buttonStyles(theme)}>
                        <FileOpen fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="inherit" onClick={handleSaveFile} sx={buttonStyles(theme)}>
                        <Save fontSize="small" />
                    </IconButton>
                </ButtonGroup>
            </ActionToolbar>
        </StyledAppBar>
    );
};

export default TitleBar; 