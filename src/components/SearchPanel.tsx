import React, { useEffect, useRef } from 'react';
import { Box, IconButton, TextField, Tooltip } from '@mui/material';
import { 
    KeyboardArrowUp as PreviousIcon,
    KeyboardArrowDown as NextIcon,
    Close as CloseIcon,
    TextFields as CaseIcon,
    TextFields as WholeWordIcon
} from '@mui/icons-material';
import { EditorView } from '@codemirror/view';
import { findNext, findPrevious, closeSearchPanel, setSearchQuery, SearchQuery } from '@codemirror/search';

interface SearchPanelProps {
    view: EditorView;
}

export const SearchPanel = React.forwardRef<HTMLDivElement, SearchPanelProps>(({ view }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [caseSensitive, setCaseSensitive] = React.useState(false);
    const [wholeWord, setWholeWord] = React.useState(false);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const updateSearch = (search: string) => {
        const query = new SearchQuery({
            search,
            caseSensitive,
            wholeWord
        });
        view.dispatch({
            effects: setSearchQuery.of(query)
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSearch(e.target.value);
    };

    const toggleCaseSensitive = () => {
        setCaseSensitive(!caseSensitive);
        updateSearch(inputRef.current?.value || '');
    };

    const toggleWholeWord = () => {
        setWholeWord(!wholeWord);
        updateSearch(inputRef.current?.value || '');
    };

    return (
        <Box
            ref={ref}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 1,
                backgroundColor: 'background.paper',
                borderBottom: 1,
                borderColor: 'divider'
            }}
        >
            <TextField
                inputRef={inputRef}
                size="small"
                placeholder="搜索..."
                onChange={handleInputChange}
                inputProps={{ 'main-field': 'true' }}
                sx={{ flex: 1 }}
            />
            
            <Tooltip title="区分大小写">
                <IconButton 
                    size="small"
                    onClick={toggleCaseSensitive}
                    color={caseSensitive ? "primary" : "default"}
                >
                    <CaseIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="全词匹配">
                <IconButton 
                    size="small"
                    onClick={toggleWholeWord}
                    color={wholeWord ? "primary" : "default"}
                >
                    <WholeWordIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="上一个">
                <IconButton 
                    size="small"
                    onClick={() => findPrevious(view)}
                >
                    <PreviousIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="下一个">
                <IconButton 
                    size="small"
                    onClick={() => findNext(view)}
                >
                    <NextIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="关闭">
                <IconButton 
                    size="small"
                    onClick={() => closeSearchPanel(view)}
                >
                    <CloseIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );
});

SearchPanel.displayName = 'SearchPanel'; 