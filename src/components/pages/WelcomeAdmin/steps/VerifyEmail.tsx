import { ArrowForwardRounded } from '@mui/icons-material'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { getAuth, sendEmailVerification, User } from 'firebase/auth'
import { useContext, useEffect, useState } from 'react'
import { AlertContext } from '../../../../contexts/AlertContext'

export default function VerifyEmail({ onNext }: { onNext: () => void }) {
    const auth = getAuth()
    const [user, setUser] = useState<User | null>(auth.currentUser)
    const [loading, setLoading] = useState(true)
    const [emailSent, setEmailSent] = useState(false)
    const [checking, setChecking] = useState(false)
    const { showAlert } = useContext(AlertContext)

    useEffect(() => {
        const checkUser = async () => {
            await auth.currentUser?.reload()
            setUser(auth.currentUser)
            setLoading(false)
        }

        checkUser()
    }, [])

    useEffect(() => console.log(user), [user])

    const handleSendVerification = async () => {
        if (user && !user.emailVerified) {
            await sendEmailVerification(user)
            setEmailSent(true)
        }
    }

    const handleCheckVerification = async () => {
        setChecking(true)
        await auth.currentUser?.reload()
        const updatedUser = auth.currentUser
        setUser(updatedUser)
        setChecking(false)

        if (updatedUser?.emailVerified) {
            onNext()
        } else {
            showAlert({
                message: 'Seu e-mail ainda não foi verificado',
                type: 'error',
            })
        }
    }

    if (loading) {
        return <CircularProgress />
    }

    return (
        <Box>
            {user?.emailVerified ? (
                <>
                    <Typography variant='h6' className='m-0 mb-2'>
                        E-mail verificado!
                    </Typography>
                    <Typography>
                        Seu e-mail já foi confirmado, clique no botão abaixo
                        para continuar.
                    </Typography>
                </>
            ) : (
                <>
                    <Typography variant='h6' className='m-0 mb-2'>
                        Vamos verificar seu e-mail
                    </Typography>
                    <Typography>
                        Vamos enviar um e-mail com um link de verificação para
                        você. Após confirmar você pode continuar.
                    </Typography>
                    {!emailSent && (
                        <Button
                            variant='outlined'
                            size='small'
                            onClick={handleSendVerification}
                            sx={{ mt: 2 }}
                        >
                            Enviar e-mail de verificação
                        </Button>
                    )}
                    {emailSent && (
                        <Typography
                            variant='body2'
                            color='success.main'
                            sx={{ mt: 2 }}
                        >
                            E-mail de verificação enviado! Verifique sua caixa
                            de entrada.
                        </Typography>
                    )}
                </>
            )}
            <Box className='d-flex justify-content-end mt-3'>
                <Button
                    variant='contained'
                    size='small'
                    endIcon={<ArrowForwardRounded />}
                    onClick={handleCheckVerification}
                    disabled={checking}
                >
                    {checking ? (
                        <CircularProgress size={20} color='inherit' />
                    ) : (
                        'Verifiquei o meu e-mail'
                    )}
                </Button>
            </Box>
        </Box>
    )
}
