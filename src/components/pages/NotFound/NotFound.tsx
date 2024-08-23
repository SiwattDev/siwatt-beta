import { Box, Typography, useTheme } from '@mui/material'
import IconLogo from '/src/assets/404.webp'

type NotFoundProps = {
    fullPage?: boolean
    title?: string
    message?: string
}

export default function NotFound({
    fullPage = false,
    title = '404',
    message = 'Página não encontrada',
}: NotFoundProps) {
    const theme = useTheme()

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: fullPage ? '100vh' : '100%',
                backgroundColor: fullPage
                    ? theme.palette.background.paper
                    : 'transparent',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '20px',
                    flexWrap: 'wrap',
                }}
            >
                <img
                    src={IconLogo}
                    alt='Ilustração 404'
                    style={{
                        width: '100%',
                        maxWidth: '300px',
                    }}
                />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        variant={title === '404' ? 'h1' : 'h4'}
                        sx={{ maxWidth: '404px', color: 'text.primary' }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        variant='body1'
                        sx={{ maxWidth: '404px', color: 'text.primary' }}
                    >
                        {message}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}
