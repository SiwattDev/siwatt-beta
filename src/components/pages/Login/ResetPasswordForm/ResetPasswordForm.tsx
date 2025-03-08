import { Button, TextField } from '@mui/material'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useContext, useState } from 'react'
import { AlertContext } from '../../../../contexts/AlertContext'
import { auth } from '../../../../firebase' // Importando a instância de auth do Firebase

type User = {
    email: string
}

type FieldError = {
    error: boolean
    message: string
}

type UserErrors = {
    email?: FieldError
}

type LoginFormProps = {
    setForgotPassword: any
    forgotPassword: boolean
}

export default function ResetPasswordForm({
    setForgotPassword,
    forgotPassword,
}: LoginFormProps) {
    const [user, setUser] = useState<User>({ email: '' })
    const [userErrors, setUserErrors] = useState<UserErrors>({})
    const { showAlert } = useContext(AlertContext)

    const validateField = (
        name: string,
        value: string
    ): FieldError | undefined => {
        if (name === 'email') {
            if (!value) {
                return { error: true, message: 'Email é obrigatório' }
            } else if (!/\S+@\S+\.\S+/.test(value)) {
                return { error: true, message: 'Email inválido' }
            }
        }
        return undefined
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUser((prevUser) => ({ ...prevUser, [name]: value }))

        const error = validateField(name, value)
        setUserErrors((prevErrors) => ({ ...prevErrors, [name]: error }))
    }

    const handleResetPassword = async () => {
        const emailError = validateField('email', user.email)
        setUserErrors({ email: emailError })

        if (!emailError) {
            try {
                console.log(user.email)
                await sendPasswordResetEmail(auth, user.email)
                showAlert({
                    message: 'Solicitação de redefinição de senha enviada',
                    type: 'success',
                })
            } catch (error) {
                console.error('Erro ao enviar o email de redefinição:', error)
                showAlert({
                    message: 'Erro ao solicitar redefinição de senha',
                    type: 'error',
                })
            }
        } else {
            showAlert({
                message: 'Erro ao solicitar redefinição de senha',
                type: 'error',
            })
        }
    }

    return (
        <>
            <TextField
                label='Email'
                name='email'
                variant='standard'
                fullWidth
                className='mb-3 mt-4'
                value={user.email}
                onChange={handleChange}
                error={userErrors.email?.error}
                helperText={userErrors.email?.message}
            />

            <a href='#' onClick={() => setForgotPassword(!forgotPassword)}>
                {forgotPassword ? 'Lembrei minha senha' : 'Esqueci minha senha'}
            </a>

            <Button
                variant='contained'
                className='mt-5 rounded-pill'
                fullWidth
                onClick={handleResetPassword}
            >
                Redefinir Senha
            </Button>
        </>
    )
}
