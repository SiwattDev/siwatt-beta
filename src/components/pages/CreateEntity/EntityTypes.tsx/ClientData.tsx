import { SaveRounded } from '@mui/icons-material'
import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
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
import { Client, Seller } from '../../../../types/EntityTypes'
import Address from './AddressData'
import DirectContact from './DirectContact'

type EntityTypes = 'individual' | 'legal'

export default function ClientData({
    onSave,
    data,
}: {
    onSave: (v: Client) => void
    data?: Client
}) {
    const [typeEntity, setTypeEntity] = useState<EntityTypes>('individual')
    const [client, setClient] = useState<Client>({} as Client)
    const [sellers, setSellers] = useState<Seller[]>([])
    const { user } = useContext(UserContext)
    const { showAlert } = useContext(AlertContext)
    const { backendErros } = useUtils()

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const response = await axios.get(`${baseURL}/docs`, {
                    params: {
                        user: user.id,
                        path: 'users',
                    },
                })

                const sellersUsers = response.data.filter(
                    (item: Seller) =>
                        item.user_type === 'seller' ||
                        item.user_type === 'seller'
                )
                setSellers(sellersUsers)
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
        fetchSellers()
    }, [])

    useEffect(() => {
        if (data) setClient(data)
    }, [data])

    const handleSave = () => {
        if (
            !client.name ||
            !client.phone ||
            (typeEntity === 'legal' && !client.cnpj) ||
            (typeEntity === 'individual' && !client.cpf) ||
            !client.seller ||
            !client.address.cep
        ) {
            showAlert({
                message:
                    'Por favor, preencha todos os campos obrigatórios. (*)',
                type: 'error',
            })
            return
        }
        onSave(client)
    }

    return (
        <React.Fragment>
            <Typography variant='h6' className='mb-2'>
                Dados da Entidade:
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <FormControl size='small' fullWidth>
                        <InputLabel>Tipo de Entidade</InputLabel>
                        <Select
                            label='Tipo de Entidade'
                            value={typeEntity}
                            onChange={(e) =>
                                setTypeEntity(e.target.value as EntityTypes)
                            }
                        >
                            <MenuItem value='individual'>
                                Pessoa Física
                            </MenuItem>
                            <MenuItem value='legal'>Pessoa Jurídica</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                {typeEntity === 'legal' && (
                    <React.Fragment>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label='CNPJ'
                                size='small'
                                fullWidth
                                required
                                value={client.cnpj || ''}
                                onChange={(e) =>
                                    setClient({
                                        ...client,
                                        cnpj: e.target.value,
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label='Inscrição Estadual'
                                size='small'
                                fullWidth
                                value={client.stateRegistration || ''}
                                onChange={(e) =>
                                    setClient({
                                        ...client,
                                        stateRegistration: e.target.value,
                                    })
                                }
                            />
                        </Grid>
                    </React.Fragment>
                )}
                {typeEntity === 'individual' && (
                    <Grid item xs={12} md={6}>
                        <TextField
                            label='CPF'
                            size='small'
                            fullWidth
                            required
                            value={client.cpf || ''}
                            onChange={(e) =>
                                setClient({ ...client, cpf: e.target.value })
                            }
                        />
                    </Grid>
                )}
                <Grid item xs={12} md={6}>
                    <TextField
                        label='Razão Social'
                        size='small'
                        fullWidth
                        required
                        value={client.name || ''}
                        onChange={(e) =>
                            setClient({ ...client, name: e.target.value })
                        }
                    />
                </Grid>
                {typeEntity === 'legal' && (
                    <Grid item xs={12} md={6}>
                        <TextField
                            label='Nome Fantasia'
                            size='small'
                            fullWidth
                            value={client.fantasyName || ''}
                            onChange={(e) =>
                                setClient({
                                    ...client,
                                    fantasyName: e.target.value,
                                })
                            }
                        />
                    </Grid>
                )}
                <Grid item xs={12} md={6}>
                    <TextField
                        label='Email'
                        size='small'
                        fullWidth
                        value={client.email || ''}
                        onChange={(e) =>
                            setClient({ ...client, email: e.target.value })
                        }
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label='Telefone'
                        size='small'
                        fullWidth
                        required
                        value={client.phone || ''}
                        onChange={(e) =>
                            setClient({ ...client, phone: e.target.value })
                        }
                    />
                </Grid>
            </Grid>
            <Box className='mb-3' />
            <Address
                onChange={(v) => setClient({ ...client, address: v })}
                addressData={client.address || undefined}
            />
            <Box className='mb-3' />
            <DirectContact
                onChange={(v) => setClient({ ...client, directContact: v })}
                directContactData={client.directContact || undefined}
            />
            <Box className='mb-3' />
            <Typography variant='h6' className='mb-2'>
                Vendedor Associado:
            </Typography>
            <FormControl size='small' fullWidth>
                <InputLabel required>Vendedor associado</InputLabel>
                <Select
                    label='Vendedor associado'
                    value={client.seller || ''}
                    onChange={(e) =>
                        setClient({ ...client, seller: e.target.value })
                    }
                >
                    <MenuItem value=''>Selecione o tipo</MenuItem>
                    {sellers &&
                        sellers.map((s) => (
                            <MenuItem key={s.id} value={s.id}>
                                {s.name}
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
