import React from 'react';
import { Box } from '@mui/material';
import TitleBar from './TitleBar';

interface AppLayoutProps {
    header: React.ReactElement<typeof TitleBar>;
    content: React.ReactNode;
    footer?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({
    header,
    content,
    footer
}) => {
    return (
        <Box sx={{ 
            height: '100vh',
            width: '100vw',
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {(
                <Box sx={{ 
                    flexShrink: 0,
                    borderBottom: 1,
                    borderColor: 'divider',
                    height: '68px'
                }}>
                    {header}
                </Box>
            )}

            <Box sx={{ 
                flex: 1,
                overflow: 'hidden',
                position: 'relative'
            }}>
                {content}
            </Box>

            {footer && (
                <Box sx={{ 
                    flexShrink: 0,
                    borderTop: 1,
                    borderColor: 'divider'
                }}>
                    {footer}
                </Box>
            )}
        </Box>
    );
};

export default AppLayout;