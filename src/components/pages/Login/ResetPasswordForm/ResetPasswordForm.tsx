import { Button, TextField } from '@mui/material'
import { useContext, useState } from 'react'
import { AlertContext } from '../../../../contexts/AlertContext'

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

    const handleResetPassword = () => {
        const emailError = validateField('email', user.email)
        setUserErrors({ email: emailError })

        if (!emailError) {
            console.log('Reset de senha solicitado', user)
            showAlert({
                message: 'Solicitação de redefinição de senha enviada',
                type: 'success',
            })
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
