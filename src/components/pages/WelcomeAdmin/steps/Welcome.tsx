import { ArrowForwardRounded } from '@mui/icons-material'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertContext } from '../../../../contexts/AlertContext'
import { WelcomeContext } from '../../../../contexts/WelcomeContext'

export default function Welcome({ onNext }: { onNext: () => void }) {
    const auth = getAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const { showAlert } = useContext(AlertContext)
    const { data } = useContext(WelcomeContext)

    const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.substring(1)
    }

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                await signOut(auth)
                await signInWithEmailAndPassword(
                    auth,
                    data.user.email,
                    '@van107669#'
                )
                setLoading(false)
            } catch (error) {
                showAlert({
                    message: 'Algo está errado, tente fazer login',
                    type: 'error',
                })
                console.error('Erro ao fazer login:', error)
                setTimeout(() => navigate('/'), 3000)
            }
        }

        authenticateUser()
    }, [auth, data, navigate])

    if (loading) {
        return (
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                height='100vh'
            >
                <CircularProgress />
            </Box>
        )
    }

    return (
        <>
            <Typography variant='h5' className='text-center mb-3'>
                Bem-vindo, {capitalizeFirstLetter(data.user.name)}!
            </Typography>
            <Typography className='fw-bold'>
                Você foi cadastrado como administrador da empresa CredFácil!
            </Typography>
            <Typography>
                Para garantir a segurança e liberar o acesso ao sistema,
                precisamos que você confirme seu e-mail e complete algumas
                informações importantes para o seu perfil. Isso levará apenas
                alguns minutos, e depois você estará pronto para gerenciar tudo
                com total controle e facilidade.
            </Typography>
            <Box className='d-flex justify-content-end mt-3'>
                <Button
                    variant='contained'
                    size='small'
                    endIcon={<ArrowForwardRounded />}
                    onClick={onNext}
                >
                    Continuar
                </Button>
            </Box>
        </>
    )
}
