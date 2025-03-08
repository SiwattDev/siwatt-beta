import { ArrowForwardRounded } from '@mui/icons-material'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertContext } from '../../../../contexts/AlertContext'

export default function Welcome({ onNext }: { onNext: () => void }) {
    const email = 'vansistem@gmail.com'
    const auth = getAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [userName, setUserName] = useState<string>('')
    const { showAlert } = useContext(AlertContext)

    const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.substring(1)
    }

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                await signOut(auth)
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    '@van107669#'
                )
                const user = userCredential.user
                setLoading(false)

                const name = user.displayName || user.email?.split('@')[0]
                setUserName(name as string)
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
    }, [auth, email, navigate])

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
                Bem-vindo, {capitalizeFirstLetter(userName)}!
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
