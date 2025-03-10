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
import axios from 'axios'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertContext } from '../../../../contexts/AlertContext'
import { WelcomeContext } from '../../../../contexts/WelcomeContext'
import { baseURL } from '../../../../globals'
import useAuth from '../../../../hooks/useAuth'
import useUtils from '../../../../hooks/useUtils'
import { Company } from '../../../../types/CompanyTypes'
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
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()
    const { setData } = useContext(WelcomeContext)

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

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const emailError = validateField('email', user.email)
        const passwordError = validateField('password', user.password)
        setUserErrors({ email: emailError, password: passwordError })

        if (!emailError && !passwordError) {
            try {
                const loginResponse = await login(user)
                if (
                    loginResponse &&
                    loginResponse.user &&
                    loginResponse.user.emailVerified
                ) {
                    setLoading(false)
                    showAlert({
                        message: 'Login feito com sucesso',
                        type: 'success',
                    })
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                    navigate('/dashboard')
                } else if (
                    loginResponse &&
                    loginResponse.user &&
                    !loginResponse.user.emailVerified
                ) {
                    const userData = await axios.get(`${baseURL}/users`, {
                        params: {
                            user: loginResponse.user.uid,
                            uid: loginResponse.user.uid,
                        },
                    })

                    const companyData = await axios.get(`${baseURL}/doc`, {
                        params: {
                            user: loginResponse.user.uid,
                            path: 'companies',
                            id: userData.data.company,
                        },
                    })

                    if (!userData.data || !companyData.data) {
                        showAlert({
                            message: 'Erro ao buscar os dados do usuário',
                            type: 'error',
                        })
                        throw new Error()
                    }

                    if (
                        (companyData.data as Company).admin ===
                        userData.data.email
                    ) {
                        setData({
                            user: {
                                name: userData.data.displayName || '',
                                email: userData.data.email || '',
                            },
                            company: companyData.data as Company,
                        })
                        navigate('/welcome')
                    } else {
                        setLoading(false)
                        showAlert({
                            message: 'Login feito com sucesso',
                            type: 'success',
                        })
                        await new Promise((resolve) =>
                            setTimeout(resolve, 1000)
                        )
                        navigate('/dashboard')
                    }
                }
            } catch (error) {
                console.log(error)
                const err: any = error
                const code =
                    err?.response?.data?.code || err.code || 'UNKNOWN_ERROR'
                const message =
                    backendErros(code) || err.message || 'Erro inesperado'
                showAlert({ message, type: 'error' })
            }
        } else {
            showAlert({ message: 'Campos inválidos', type: 'error' })
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleLogin}>
            <TextField
                label='Email'
                name='email'
                type='email'
                variant='standard'
                fullWidth
                className='mb-5 mt-4'
                value={user.email}
                onChange={handleChange}
                error={!!userErrors.email?.error}
                helperText={userErrors.email?.message}
                aria-label='Email'
            />
            <FormControl
                variant='standard'
                fullWidth
                error={!!userErrors.password?.error}
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
                    aria-label='Senha'
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
            <a
                href='#'
                onClick={() => setForgotPassword(!forgotPassword)}
                className='d-block text-decoration-none mt-3'
            >
                {forgotPassword ? 'Lembrei minha senha' : 'Esqueci minha senha'}
            </a>
            <Button
                variant='contained'
                className='mt-5 rounded-pill'
                fullWidth
                type='submit'
                aria-label='Entrar'
            >
                Entrar
            </Button>
            {loading && (
                <Loading fullPage message='Tentando conectar você...' />
            )}
        </form>
    )
}
