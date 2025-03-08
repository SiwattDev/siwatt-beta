import { CloseRounded } from '@mui/icons-material'
import { Box, Card, CardContent, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import LogoIcon from '../../../assets/icon-logo.webp'
import LogoText from '../../../assets/logo.webp'
import CompleteInfo from './steps/CompleteInfo'
import SetPassword from './steps/SetPassword'
import VerifyEmail from './steps/VerifyEmail'
import Welcome from './steps/Welcome'

export default function WelcomeAdmin() {
    const theme = useTheme()
    const [loaded, setLoaded] = useState(false)
    const [step, setStep] = useState(1)

    const nextStep = () => setStep((prev) => prev + 1)

    useEffect(() => {
        setTimeout(() => setLoaded(true), 100)
    }, [])

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                padding: '20px',
                background: theme.palette.background.default,
                overflow: 'hidden',
                gap: '40px',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    width: '200%',
                    height: '200%',
                    top: '-50%',
                    left: '-30%',
                    background: `radial-gradient(circle at 20% 30%, ${theme.palette.primary.main}cc, transparent 20%),
                                 radial-gradient(circle at 80% 50%, ${theme.palette.primary.main}99, transparent 50%)`,
                    filter: 'blur(100px)',
                    opacity: 0,
                    transform: 'scale(0.8)',
                    animation: loaded
                        ? 'expandBackground 1.5s ease-out forwards'
                        : 'none',
                },
                '@keyframes expandBackground': {
                    '0%': { opacity: 0, transform: 'scale(0.8)' },
                    '100%': { opacity: 1, transform: 'scale(1)' },
                },
                '@keyframes fadeIn': {
                    '0%': { opacity: 0, transform: 'translateY(20px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
            }}
        >
            <Box
                className='logos d-flex gap-3 flex-column flex-sm-row align-items-center'
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    opacity: 0,
                    transform: 'translateY(20px)',
                    animation: loaded
                        ? 'fadeIn 1s ease-out 0.5s forwards'
                        : 'none',
                }}
            >
                <Box className='partner-logo'>
                    <img
                        src='https://franquiacredfacil.com.br/wp-content/uploads/2023/06/logo-credfacil-v2.png'
                        width='auto'
                        height='40'
                        alt='Logo Siwatt'
                    />
                </Box>
                <CloseRounded style={{ color: 'white' }} />
                <Box className='siwatt-logo'>
                    <img
                        src={LogoIcon}
                        width='35'
                        height='35'
                        alt='Logo Siwatt'
                    />
                    <img
                        src={LogoText}
                        height='25'
                        className='ms-2'
                        alt='Nome Siwatt'
                    />
                </Box>
            </Box>
            <Card
                sx={{
                    width: '100%',
                    maxWidth: '600px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(15px)',
                    padding: '20px',
                    borderRadius: '12px',
                    color: '#fff',
                    zIndex: 1,
                    opacity: 0,
                    transform: 'translateY(20px)',
                    animation: loaded
                        ? 'fadeIn 1s ease-out 0.8s forwards'
                        : 'none',
                }}
            >
                <CardContent>
                    <Box>
                        {step === 1 && <Welcome onNext={nextStep} />}
                        {step === 2 && <VerifyEmail onNext={nextStep} />}
                        {step === 3 && <CompleteInfo onNext={nextStep} />}
                        {step === 4 && <SetPassword />}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}
