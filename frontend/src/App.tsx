import { useState, useEffect } from 'react'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import Home from './components/Home/Home'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'
import LanguageSelector from './components/LanguageSelector/LanguageSelector'

const createAppTheme = (mode: 'light' | 'dark') => createTheme({
    palette: {
        mode,
        primary: {
            main: '#ff6b35'
        },
        secondary: {
            main: '#f72585'
        },
        background: {
            default: mode === 'dark' ? '#0d1117' : '#ffffff',
            paper: mode === 'dark' ? '#161b22' : '#f5f5f5',
        },
        text: {
            primary: mode === 'dark' ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
            secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
        }
    },
    typography: {
        h1: {
            fontWeight: 700,
            background: 'linear-gradient(45deg, #ff6b35 30%, #f72585 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        }
    }
})

function App() {

    const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
        const savedTheme = localStorage.getItem('dondisco-theme')
        return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark'
    })
    
    const theme = createAppTheme(themeMode)

    const toggleTheme = () => {
        setThemeMode(prevMode => {
            const newMode = prevMode === 'light' ? 'dark' : 'light'
            localStorage.setItem('dondisco-theme', newMode)
            return newMode
        })
    }

    useEffect(() => {
        // Aplicar transición suave al body
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease'
        return () => {
            document.body.style.transition = ''
        }
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div style={{ 
                minHeight: '100vh',
                margin: 0,
                minWidth: '320px',
                fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
                lineHeight: 1.5,
                fontWeight: 400,
                fontSynthesis: 'none',
                textRendering: 'optimizeLegibility',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale'
            }}>
                <ThemeToggle 
                    currentTheme={themeMode} 
                    onToggle={toggleTheme} 
                />
                <LanguageSelector />
                <Home />
            </div>
        </ThemeProvider>
    )
}

export default App