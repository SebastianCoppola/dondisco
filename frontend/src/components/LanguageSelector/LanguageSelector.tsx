import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const LanguageSelector = () => {

    const { i18n, t } = useTranslation()
    
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleLanguageChange = (language: string) => {
        i18n.changeLanguage(language)
        handleClose()
    }

    const getCurrentLanguageLabel = () => {
        return i18n.language.startsWith('es') ? 'ES' : 'EN'
    }

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '80px',
            zIndex: 1000
        }}>
            <Tooltip title={t('language')}>
                <IconButton
                    onClick={handleClick}
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'text.primary',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s ease-in-out',
                        width: 50,
                        height: 50,
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}
                >
                    {getCurrentLanguageLabel()}
                </IconButton>
            </Tooltip>
            
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                sx={{
                    '& .MuiPaper-root': {
                        backgroundColor: 'background.paper',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 2,
                        minWidth: 120
                    }
                }}
            >
                <MenuItem 
                    onClick={() => handleLanguageChange('es')}
                    selected={i18n.language.startsWith('es')}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        '&.Mui-selected': {
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            }
                        }
                    }}
                >
                    🇪🇸 {t('spanish')}
                </MenuItem>
                <MenuItem 
                    onClick={() => handleLanguageChange('en')}
                    selected={i18n.language.startsWith('en')}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        '&.Mui-selected': {
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            }
                        }
                    }}
                >
                    🇺🇸 {t('english')}
                </MenuItem>
            </Menu>
        </div>
    )
}

export default LanguageSelector