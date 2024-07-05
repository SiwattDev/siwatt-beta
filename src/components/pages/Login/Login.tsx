import { Box, Card, CardContent, useMediaQuery, useTheme } from '@mui/material'
import { useState } from 'react'
import IconLogo from '../../../assets/icon-logo.png'
import Illustration from '../../../assets/login.png'
import TextLogo from '../../../assets/logo.png'
import LoginForm from './LoginForm/LoginForm'
import ResetPasswordForm from './ResetPasswordForm/ResetPasswordForm'
import ToastCustom from '../../template/ToastCustom/ToastCustom'

export default function Login() {
    const [forgotPassword, setForgotPassword] = useState(false)
    const theme = useTheme()
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'))

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                padding: '20px',
                background: theme.palette.background.default,
            }}
        >
            <Box
                sx={{ alignItems: 'center', marginBottom: '25px' }}
                className='d-flex d-md-none'
            >
                <img
                    src={IconLogo}
                    alt='Ícone da logo do Siwatt'
                    height={50}
                    className='me-2'
                />
                <img
                    src={TextLogo}
                    alt='Texto da logo com o nome Siwatt'
                    height={35}
                />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    width: '100%',
                    maxWidth: '900px',
                    justifyContent: 'space-between',
                }}
            >
                <Card
                    sx={{
                        flex: 1,
                        backgroundColor: theme.palette.secondary.main,
                    }}
                    className='rounded-0 rounded-start-4 px-4 d-none d-md-flex'
                    elevation={3}
                >
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Box
                            sx={{ alignItems: 'center', marginBottom: '16px' }}
                        >
                            <img
                                src={IconLogo}
                                alt='Ícone da logo do Siwatt'
                                height={50}
                                className='me-2'
                                style={{
                                    filter: 'grayscale(1) brightness(0)',
                                }}
                            />
                            <img
                                src={TextLogo}
                                alt='Texto da logo com o nome Siwatt'
                                height={35}
                                style={{
                                    filter: 'grayscale(1) brightness(0)',
                                }}
                            />
                        </Box>
                        <img
                            src={Illustration}
                            alt='Ilustração para a tela de login'
                            width={360}
                            style={{ maxWidth: '100%' }}
                        />
                    </CardContent>
                </Card>
                <Card
                    sx={{
                        flex: 1,
                        backgroundColor: theme.palette.background.default,
                        borderRadius: isMdUp ? '0 16px 16px 0' : '16px',
                    }}
                    className='px-4'
                    elevation={3}
                >
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                        }}
                    >
                        <h1 style={{ textAlign: 'center' }}>
                            {forgotPassword
                                ? 'Redefinir Senha'
                                : 'Entre na sua conta'}
                        </h1>
                        {forgotPassword ? (
                            <ResetPasswordForm
                                setForgotPassword={setForgotPassword}
                                forgotPassword={forgotPassword}
                            />
                        ) : (
                            <LoginForm
                                setForgotPassword={setForgotPassword}
                                forgotPassword={forgotPassword}
                            />
                        )}
                    </CardContent>
                </Card>
            </Box>
            <ToastCustom />
        </Box>
    )
}
