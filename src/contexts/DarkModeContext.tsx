import { ThemeProvider, createTheme, useTheme } from '@mui/material'
import { ReactNode, createContext, useEffect, useState } from 'react'

interface DarkModeContextType {
    darkMode: boolean
    toggleTheme: () => void
}

const DarkModeContext = createContext<DarkModeContextType>({
    darkMode: false,
    toggleTheme: () => {},
})

function DarkModeProvider({ children }: { children: ReactNode }) {
    const customTheme = useTheme()
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        const savedDarkMode = localStorage.getItem('darkMode')
        return savedDarkMode ? JSON.parse(savedDarkMode) : false
    })

    const toggleTheme = () => {
        const newDarkMode = !darkMode
        setDarkMode(newDarkMode)
        localStorage.setItem('darkMode', JSON.stringify(newDarkMode))
    }

    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode')
        if (savedDarkMode) {
            setDarkMode(JSON.parse(savedDarkMode))
        }
    }, [])

    const theme = createTheme({
        ...customTheme,
        palette: {
            ...customTheme.palette,
            mode: darkMode ? 'dark' : 'light',
            background: {
                default: darkMode ? '#0e0f10' : '#f0f2f5',
                paper: darkMode ? '#07090c' : '#fff',
            },
            text: {
                primary: darkMode ? '#fff' : '#000',
                secondary: darkMode ? '#99a3acbf' : '#212529bf',
            },
        },
        components: {
            MuiIconButton: {
                defaultProps: {
                    style: {
                        color: 'inherit',
                    },
                },
            },
            MuiInputAdornment: {
                defaultProps: {
                    style: {
                        color: 'inherit',
                    },
                },
            },
            MuiSvgIcon: {
                defaultProps: {
                    style: {
                        color: 'currentColor',
                    },
                },
            },
            MuiListItemIcon: {
                defaultProps: {
                    style: {
                        color: 'inherit',
                    },
                },
            },
        },
    })

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleTheme }}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </DarkModeContext.Provider>
    )
}

export { DarkModeContext, DarkModeProvider }
