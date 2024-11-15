import { AppBar, Toolbar, Typography, ButtonGroup, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
// import SettingsIcon from '@mui/icons-material/Settings';
// import FormatBoldIcon from '@mui/icons-material/FormatBold';
// import FormatItalicIcon from '@mui/icons-material/FormatItalic';
// import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { Visibility, VerticalSplit, Code } from '@mui/icons-material';

const StyledAppBar = styled(AppBar)({
    WebkitAppRegion: 'drag', // 允许拖动窗口
    backgroundColor: 'transparent',
    boxShadow: 'none',
});

const TitleToolbar = styled(Toolbar)({
    minHeight: '38px !important', // 标题栏固定高度
    padding: '0 10px 2px 10px !important',
    paddingLeft: '80px !important', // 为红绿灯按钮留出空间
});

const ActionToolbar = styled(Toolbar)({
    minHeight: '30px !important',
    padding: '0 16px !important',
    borderBottom: '1px solid',
    borderColor: 'rgba(0, 0, 0, 0.12)',
});

interface TitleBarProps {
    viewMode: 'preview' | 'split' | 'source';
    setViewMode: React.Dispatch<React.SetStateAction<'preview' | 'split' | 'source'>>;
}

const TitleBar: React.FC<TitleBarProps> = ({ viewMode, setViewMode }) => {
    return (
        <StyledAppBar position="static">
            {/* 标题栏 */}
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
                    Quillify
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
                            minWidth: '38px'
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

            {/* 工具栏 */}
            <ActionToolbar>
                {/* 左侧按钮组 */}
                <ButtonGroup sx={{ flexGrow: 1 }}>
                    {/* <IconButton size="small" color="inherit">
                        <FormatBoldIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="inherit">
                        <FormatItalicIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="inherit">
                        <FormatListBulletedIcon fontSize="small" />
                    </IconButton> */}
                </ButtonGroup>

                {/* 右侧按钮组 */}
                <ButtonGroup>
                    {/* <IconButton size="small" color="inherit">
                        <SettingsIcon fontSize="small" />
                    </IconButton> */}
                </ButtonGroup>
            </ActionToolbar>
        </StyledAppBar>
    );
};

export default TitleBar; 