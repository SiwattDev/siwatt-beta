import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
    Button,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material'
import { updatePassword } from 'firebase/auth'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertContext } from '../../../../contexts/AlertContext'
import { auth } from '../../../../firebase'

export default function SetPassword() {
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const { showAlert } = useContext(AlertContext)
    const navigate = useNavigate()

    const handleChangePassword = async () => {
        const user = auth.currentUser
        if (!user) {
            showAlert({
                message: 'Usuário não autenticado',
                type: 'error',
            })
            return
        }

        if (password.length < 6) {
            showAlert({
                message: 'A senha deve ter pelo menos 6 caracteres',
                type: 'warning',
            })
            return
        }

        setLoading(true)
        try {
            await updatePassword(user, password)
            showAlert({
                message: 'Senha alterada com sucesso',
                type: 'success',
            })
            setPassword('')
            navigate('/dashboard')
        } catch (error) {
            console.error('Erro ao alterar senha:', error)
            showAlert({
                message:
                    'Erro ao alterar senha. Faça login novamente e tente de novo.',
                type: 'error',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Typography variant='h6' className='m-0 mb-3'>
                Escolha uma nova senha
            </Typography>
            <TextField
                label='Senha'
                type={showPassword ? 'text' : 'password'}
                size='small'
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position='end'>
                            <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge='end'
                            >
                                {showPassword ? (
                                    <VisibilityOff />
                                ) : (
                                    <Visibility />
                                )}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <Button
                variant='contained'
                fullWidth
                className='mt-3'
                onClick={handleChangePassword}
                disabled={loading}
            >
                {loading ? 'Alterando...' : 'Alterar Senha'}
            </Button>
        </>
    )
}
