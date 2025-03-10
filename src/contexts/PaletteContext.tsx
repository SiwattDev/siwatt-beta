import { ThemeProvider, createTheme, useTheme } from '@mui/material'
import { ReactNode, createContext, useEffect, useState } from 'react'

interface PaletteContextType {
    primaryColor: string
    setPrimaryColor: React.Dispatch<React.SetStateAction<string>>
}

const PaletteContext = createContext<PaletteContextType>({
    primaryColor: '',
    setPrimaryColor: () => {},
})

function hexToRgb(hex: string) {
    hex = hex.replace('#', '')

    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    return { r, g, b }
}

function rgbToHex(r: number, g: number, b: number) {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`
}

function adjustColor(color: string, factor: number) {
    const { r, g, b } = hexToRgb(color)

    const newR = Math.min(255, Math.max(0, r * factor))
    const newG = Math.min(255, Math.max(0, g * factor))
    const newB = Math.min(255, Math.max(0, b * factor))

    return rgbToHex(newR, newG, newB)
}

function generatePalette(hex: string) {
    const lightFactor = 1.3
    const darkFactor = 0.7

    const light = adjustColor(hex, lightFactor)
    const dark = adjustColor(hex, darkFactor)
    const pale = `${hex.slice(0, 7)}57`

    return {
        main: hex,
        light,
        dark,
        contrastText: '#fff',
        pale,
    }
}

function PaletteProvider({ children }: { children: ReactNode }) {
    const theme = useTheme()
    const [primaryColor, setPrimaryColor] = useState<string>('#3e4c5c')

    useEffect(() => {
        console.log(generatePalette(primaryColor))
    }, [primaryColor])

    const customTheme = createTheme({
        ...theme,
        palette: {
            ...theme.palette,
            primary: generatePalette(primaryColor),
        },
    })

    return (
        <PaletteContext.Provider value={{ primaryColor, setPrimaryColor }}>
            <ThemeProvider theme={customTheme}>{children}</ThemeProvider>
        </PaletteContext.Provider>
    )
}

export { PaletteContext, PaletteProvider }
