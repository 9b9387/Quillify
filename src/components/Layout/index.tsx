import { ReactNode } from 'react';
import { Box } from '@mui/material';

interface LayoutProps {
    header?: ReactNode;
    content?: ReactNode;
    sidebar?: ReactNode;
    footer?: ReactNode;
}

const Layout = ({ header, content, sidebar, footer }: LayoutProps) => {
    return (
        <Box sx={{ 
            height: '100vh',
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/* 头部区域 */}
            {header && (
                <Box sx={{ 
                    flexShrink: 0,
                    borderBottom: 1,
                    borderColor: 'divider'
                }}>
                    {header}
                </Box>
            )}

            {/* 主要内容区域 */}
            <Box sx={{ 
                flex: 1,
                display: 'flex',
                minHeight: 0
            }}>
                {/* 侧边栏 */}
                {sidebar && (
                    <Box sx={{ 
                        width: 240,
                        flexShrink: 0,
                        borderRight: 1,
                        borderColor: 'divider',
                        overflow: 'auto'
                    }}>
                        {sidebar}
                    </Box>
                )}

                {/* 内容区域 */}
                <Box sx={{ 
                    flex: 1,
                    overflow: 'auto',
                    position: 'relative'
                }}>
                    {content}
                </Box>
            </Box>

            {/* 底部区域 */}
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

export default Layout; 