import { Box, CircularProgress, Typography, useTheme } from '@mui/material'

type LoadingProps = {
    size?: number
    fullPage?: boolean
    message?: string
}

export default function Loading({
    size = 35,
    fullPage = false,
    message = 'Carregando...',
}: LoadingProps) {
    const theme = useTheme()

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: fullPage ? 'fixed' : 'relative',
                height: fullPage ? '100vh' : '100%',
                width: fullPage ? '100vw' : '100%',
                top: 0,
                left: 0,
                backgroundColor: fullPage
                    ? theme.palette.mode === 'dark'
                        ? '#000'
                        : '#fff'
                    : 'transparent',
                backdropFilter: fullPage ? 'blur(5px)' : 'none',
            }}
        >
            <CircularProgress size={size} className='mb-2' />
            <Typography sx={{ color: theme.palette.text.secondary }}>
                {message}
            </Typography>
        </Box>
    )
}
