import { IconButton, Tooltip } from '@mui/material'
import { DarkMode, LightMode } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface IThemeToggle {
    currentTheme: 'light' | 'dark'
    onToggle: () => void
}

const ThemeToggle = ({ currentTheme, onToggle }: IThemeToggle) => {
    
    const { t } = useTranslation()
    
    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000
        }}>
            <Tooltip title={currentTheme === 'dark' ? t('switchToLight') : t('switchToDark')}>
                <IconButton
                    onClick={onToggle}
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: currentTheme === 'dark' ? '#fff' : '#000',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s ease-in-out',
                        width: 50,
                        height: 50
                    }}
                >
                    {currentTheme === 'dark' ? 
                        <LightMode sx={{ fontSize: 24 }} /> : 
                        <DarkMode sx={{ fontSize: 24 }} />
                    }
                </IconButton>
            </Tooltip>
        </div>
    )
}

export default ThemeToggle