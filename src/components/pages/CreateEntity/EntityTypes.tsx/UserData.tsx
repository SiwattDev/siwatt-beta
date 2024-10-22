import { SaveRounded, Visibility, VisibilityOff } from '@mui/icons-material'
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    Typography,
} from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AlertContext } from '../../../../contexts/AlertContext'
import { UserContext } from '../../../../contexts/UserContext'
import { baseURL } from '../../../../globals'
import useUtils from '../../../../hooks/useUtils'
import { User } from '../../../../types/EntityTypes'
import { Unit } from '../../../../types/UnitType'
import Address from './AddressData'

export default function UserData({
    onSave,
    data,
}: {
    onSave: (v: User) => void
    data?: User
}) {
    const [user, setUser] = useState<User>({} as User)
    const { user: currentUser } = useContext(UserContext)
    const [units, setUnits] = useState<Unit[]>([])
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        if (data) setUser(data)
    }, [data])

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const response = await axios.get(`${baseURL}/docs`, {
                    params: {
                        user: currentUser.id,
                        path: 'units',
                    },
                })

                setUnits(response.data)
            } catch (error) {
                console.log(error)
                const err: any = error
                const code =
                    err?.response?.data?.code || err.code || 'UNKNOWN_ERROR'
                const message =
                    backendErros(code) || err.message || 'Erro inesperado'
                showAlert({ message, type: 'error' })
            }
        }
        fetchUnits()
    }, [])

    const handleSave = () => {
        if (
            !user.name ||
            !user.email ||
            !user.phone ||
            (!user.password && !data) ||
            !user.type ||
            !user.unit ||
            !user.address.cep
        ) {
            console.log(user)
            showAlert({
                message:
                    'Por favor, preencha todos os campos obrigatórios. (*)',
                type: 'error',
            })
            return
        }
        onSave(user)
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault()
    }

    return (
        <React.Fragment>
            <Typography variant='h6' className='mb-2'>
                Dados da Entidade:
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label='Nome'
                        size='small'
                        fullWidth
                        value={user.name || ''}
                        required
                        onChange={(e) =>
                            setUser({ ...user, name: e.target.value })
                        }
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label='Email'
                        size='small'
                        fullWidth
                        value={user.email || ''}
                        type='email'
                        required
                        onChange={(e) =>
                            setUser({ ...user, email: e.target.value })
                        }
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label='Telefone'
                        size='small'
                        fullWidth
                        value={user.phone || ''}
                        type='tel'
                        required
                        onChange={(e) =>
                            setUser({ ...user, phone: e.target.value })
                        }
                    />
                </Grid>
                {!data && (
                    <Grid item xs={12} md={6}>
                        <FormControl size='small' fullWidth required>
                            <InputLabel htmlFor='password'>Senha</InputLabel>
                            <OutlinedInput
                                id='password'
                                type={showPassword ? 'text' : 'password'}
                                value={user.password || ''}
                                onChange={(e) =>
                                    setUser({
                                        ...user,
                                        password: e.target.value,
                                    })
                                }
                                endAdornment={
                                    <InputAdornment position='end'>
                                        <IconButton
                                            aria-label='toggle password visibility'
                                            onClick={handleClickShowPassword}
                                            onMouseDown={
                                                handleMouseDownPassword
                                            }
                                            edge='end'
                                        >
                                            {showPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label='Senha'
                            />
                            <FormHelperText>
                                Por favor, anote a senha para não esquecê-la.
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                )}
            </Grid>
            <Box className='mb-3' />
            <Address
                onChange={(v) => setUser({ ...user, address: v })}
                addressData={user.address || undefined}
            />
            <Box className='mb-3' />
            <Typography variant='h6' className='mb-2'>
                Tipo de usuário:
            </Typography>
            <FormControl size='small' fullWidth>
                <InputLabel required>Tipo de usuário</InputLabel>
                <Select
                    label='Tipo de usuário'
                    value={user.type || ''}
                    onChange={(e) =>
                        setUser({
                            ...user,
                            type: e.target.value as
                                | 'business_intermediator'
                                | 'ceo'
                                | 'commercial_diretor'
                                | 'commercial_manager'
                                | 'sales_manager',
                        })
                    }
                >
                    <MenuItem value=''>Selecione o tipo</MenuItem>
                    <MenuItem value='business_intermediator'>
                        Intermediário de Negócios
                    </MenuItem>
                    <MenuItem value='ceo'>CEO</MenuItem>
                    <MenuItem value='commercial_diretor'>
                        Diretor Comercial
                    </MenuItem>
                    <MenuItem value='commercial_manager'>
                        Gerente Comercial
                    </MenuItem>
                    <MenuItem value='sales_manager'>Gerente de Vendas</MenuItem>
                </Select>
            </FormControl>
            <Box className='mb-3' />
            <Typography variant='h6' className='mb-2'>
                Unidade Pertencente:
            </Typography>
            <FormControl size='small' fullWidth>
                <InputLabel required>Unidade Pertencente:</InputLabel>
                <Select
                    label='Unidade Pertencente:'
                    value={user.unit || ''}
                    onChange={(e) => setUser({ ...user, unit: e.target.value })}
                >
                    <MenuItem value=''>Selecione a unidade</MenuItem>
                    {units &&
                        units.map((u) => (
                            <MenuItem key={u.id} value={u.id}>
                                {u.name}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
            <Box className='mb-3' />
            <Button variant='contained' onClick={handleSave}>
                <SaveRounded className='me-1' /> Salvar
            </Button>
        </React.Fragment>
    )
}
