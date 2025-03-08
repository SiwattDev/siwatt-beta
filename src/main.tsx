import { ThemeProvider, createTheme } from '@mui/material'
import { LoadScript } from '@react-google-maps/api'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import 'react-toastify/dist/ReactToastify.min.css'
import { AlertProvider } from './contexts/AlertContext.tsx'
import { BudgetProvider } from './contexts/BudgetContext.tsx'
import { DarkModeProvider } from './contexts/DarkModeContext.tsx'
import { SearchProvider } from './contexts/SearchContext.tsx'
import { UserProvider } from './contexts/UserContext.tsx'
import Router from './router.tsx'

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#ffffff',
            light: '#ffffff',
            dark: '#cccccc',
            contrastText: '#000',
            pale: '#ffffff57',
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
                <AlertProvider>
                    <UserProvider>
                        <BudgetProvider>
                            <SearchProvider>
                                <LoadScript googleMapsApiKey='AIzaSyAGtVVBpO7_y0RwYRXaCpu_aEg7pAyxfsg'>
                                    <Router />
                                </LoadScript>
                            </SearchProvider>
                        </BudgetProvider>
                    </UserProvider>
                </AlertProvider>
            </DarkModeProvider>
        </ThemeProvider>
    </React.StrictMode>
)
