import {
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from '@mui/material'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { BudgetContext } from '../../../../../../contexts/BudgetContext'
import { UserContext } from '../../../../../../contexts/UserContext'
import { baseURL } from '../../../../../../globals'
import { Client } from '../../../../../../types/EntityTypes'

export default function ClientStep() {
    const [clients, setClients] = useState<Client[]>([])
    const { budget, setBudget } = useContext(BudgetContext)
    const [selectedClient, setSelectedClient] = useState<string>('')
    const { user } = useContext(UserContext)

    useEffect(() => {
        if (typeof budget.client === 'string') {
            setSelectedClient(budget.client)
        } else if (typeof budget.client === 'object') {
            setSelectedClient(budget.client.id)
        } else {
            setSelectedClient('')
        }
    }, [budget.client])

    useEffect(() => {
        const fetchClients = async () => {
            const response = await axios.get(`${baseURL}/docs`, {
                params: {
                    user: user.id,
                    path: 'clients',
                },
            })
            setClients(response.data)
        }

        fetchClients()
    }, [user.id])

    const handleChange = (event: SelectChangeEvent<string>) => {
        setSelectedClient(event.target.value as string)
        setBudget({ ...budget, client: event.target.value })
    }

    const findClient = (id: string) => {
        return clients.find((client) => client.id === id)
    }

    const selectedClientData = findClient(selectedClient)

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} className='pt-0 mb-2'>
                <Typography variant='h6'>Selecione um cliente</Typography>
            </Grid>
            {clients && (
                <>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size='small'>
                            <InputLabel required>
                                Selecione um cliente
                            </InputLabel>
                            <Select
                                required
                                value={selectedClient}
                                onChange={handleChange}
                                label='Selecione um cliente'
                            >
                                <MenuItem value={''}>
                                    <em>Selecione um cliente</em>
                                </MenuItem>
                                {clients.map((client) => (
                                    <MenuItem key={client.id} value={client.id}>
                                        {client.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            size='small'
                            disabled
                            fullWidth
                            label='ID do cliente'
                            value={selectedClient || ''}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            size='small'
                            disabled
                            fullWidth
                            label='E-mail do cliente'
                            value={selectedClientData?.email || ''}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            size='small'
                            disabled
                            fullWidth
                            label='Telefone do cliente'
                            value={selectedClientData?.phone || ''}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            size='small'
                            disabled
                            fullWidth
                            label={
                                selectedClientData?.cpf
                                    ? 'CPF do cliente'
                                    : 'CNPJ do cliente'
                            }
                            value={
                                selectedClientData?.cpf ||
                                selectedClientData?.cnpj ||
                                ''
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            size='small'
                            disabled
                            fullWidth
                            label='Cep do cliente'
                            value={selectedClientData?.address.cep || ''}
                        />
                    </Grid>
                </>
            )}
        </Grid>
    )
}
