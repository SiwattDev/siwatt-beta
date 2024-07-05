import { ThemeProvider, createTheme } from '@mui/material'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import 'react-toastify/dist/ReactToastify.css'
import { BudgetProvider } from './contexts/BudgetContext.tsx'
import { DarkModeProvider } from './contexts/DarkModeContext.tsx'
import { UserProvider } from './contexts/UserContext.tsx'
import Router from './router.tsx'

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#0656B4',
            light: '#3b81df',
            dark: '#003b88',
            contrastText: '#fff',
            pale: '#0a66d157',
        },
        secondary: {
            main: '#FDC611',
            light: '#FFD743',
            dark: '#C59600',
            contrastText: '#000',
            pale: '#FFD74357',
        },
        hover: {
            main: '#f0f2f5',
            pale: '#c1c6cf9e',
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 768,
            lg: 1200,
            xl: 1536,
        },
    },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <DarkModeProvider>
                <UserProvider>
                    <BudgetProvider>
                        <Router />
                    </BudgetProvider>
                </UserProvider>
            </DarkModeProvider>
        </ThemeProvider>
    </React.StrictMode>
)
