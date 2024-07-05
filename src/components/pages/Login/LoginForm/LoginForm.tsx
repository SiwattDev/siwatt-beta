import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
    Button,
    FormControl,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    TextField,
} from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import useAuth from '../../../../hooks/useAuth'
import Loading from '../../../template/Loading/Loading'

type User = {
    email: string
    password: string
}

type FieldError = {
    error: boolean
    message: string
}

type UserErrors = {
    email?: FieldError
    password?: FieldError
}

type LoginFormProps = {
    setForgotPassword: any
    forgotPassword: boolean
}

export default function LoginForm({
    setForgotPassword,
    forgotPassword,
}: LoginFormProps) {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<User>({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [userErrors, setUserErrors] = useState<UserErrors>({})
    const { login } = useAuth()
    const navigate = useNavigate()

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
        } else if (name === 'password') {
            if (!value) {
                return { error: true, message: 'Senha é obrigatória' }
            } else if (value.length < 6) {
                return {
                    error: true,
                    message: 'Senha deve ter no mínimo 6 caracteres',
                }
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

    const handleLogin = async () => {
        setLoading(true)
        const emailError = validateField('email', user.email)
        const passwordError = validateField('password', user.password)
        setUserErrors({ email: emailError, password: passwordError })

        if (!emailError && !passwordError) {
            try {
                const loginResponse = await login(user)
                if (loginResponse && loginResponse.user) {
                    setLoading(false)
                    toast.success('Login feito com sucesso')
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                    navigate('/dashboard')
                }
            } catch (error: any) {
                setLoading(false)
                toast.error(error.message)
            }
        } else toast.error('Preencha os dados corretamente')
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
            <FormControl
                variant='standard'
                fullWidth
                error={userErrors.password?.error}
            >
                <InputLabel>Senha</InputLabel>
                <Input
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    value={user.password}
                    onChange={handleChange}
                    endAdornment={
                        <InputAdornment position='end'>
                            <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                size='small'
                            >
                                {showPassword ? (
                                    <Visibility fontSize='small' />
                                ) : (
                                    <VisibilityOff fontSize='small' />
                                )}
                            </IconButton>
                        </InputAdornment>
                    }
                />
                {userErrors.password?.message && (
                    <p
                        style={{
                            color: 'red',
                            marginTop: '8px',
                            fontSize: '12px',
                        }}
                    >
                        {userErrors.password.message}
                    </p>
                )}
            </FormControl>
            <a href='#' onClick={() => setForgotPassword(!forgotPassword)}>
                {forgotPassword ? 'Lembrei minha senha' : 'Esqueci minha senha'}
            </a>
            <Button
                variant='contained'
                className='mt-5 rounded-pill'
                fullWidth
                onClick={handleLogin}
            >
                Entrar
            </Button>
            {loading && (
                <Loading fullPage message='Tentando conectar você...' />
            )}
        </>
    )
}
