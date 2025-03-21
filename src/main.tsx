import { ThemeProvider, createTheme } from '@mui/material'
import { LoadScript } from '@react-google-maps/api'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import 'react-toastify/dist/ReactToastify.min.css'
import { AlertProvider } from './contexts/AlertContext.tsx'
import { BudgetProvider } from './contexts/BudgetContext.tsx'
import { CompanyProvider } from './contexts/CompanyContext.tsx'
import { DarkModeProvider } from './contexts/DarkModeContext.tsx'
import { PaletteProvider } from './contexts/PaletteContext.tsx'
import { SearchProvider } from './contexts/SearchContext.tsx'
import { UserProvider } from './contexts/UserContext.tsx'
import { WelcomeProvider } from './contexts/WelcomeContext.tsx'
import Router from './router.tsx'

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#3e4c5c',
            light: '#697789',
            dark: '#232c38',
            contrastText: '#fff',
            pale: '#3e4c5c57',
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
                    <WelcomeProvider>
                        <UserProvider>
                            <BudgetProvider>
                                <SearchProvider>
                                    <CompanyProvider>
                                        <PaletteProvider>
                                            <LoadScript googleMapsApiKey='AIzaSyAGtVVBpO7_y0RwYRXaCpu_aEg7pAyxfsg'>
                                                <Router />
                                            </LoadScript>
                                        </PaletteProvider>
                                    </CompanyProvider>
                                </SearchProvider>
                            </BudgetProvider>
                        </UserProvider>
                    </WelcomeProvider>
                </AlertProvider>
            </DarkModeProvider>
        </ThemeProvider>
    </React.StrictMode>
)
