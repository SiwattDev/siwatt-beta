import {
    DeleteRounded,
    EditRounded,
    LockClockRounded,
    LockOpenRounded,
    LockRounded,
    LoopRounded,
    NoEncryptionRounded,
    VisibilityRounded,
} from '@mui/icons-material'
import {
    Alert,
    AlertColor,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Menu,
    MenuItem,
    Typography,
} from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertContext } from '../../../contexts/AlertContext'
import { BudgetContext } from '../../../contexts/BudgetContext'
import { UserContext } from '../../../contexts/UserContext'
import { baseURL } from '../../../globals'
import { useConfirm } from '../../../hooks/useConfirm'
import useUtils from '../../../hooks/useUtils'
import { Budget } from '../../../types/BudgetTypes'
import { Client } from '../../../types/EntityTypes'
import Confirm from '../../template/Confirm/Confirm'
import EditPlantValue from './EditPlantValue'

export default function BudgetItem({
    budget,
    update,
}: {
    budget: Budget
    update: () => void
}) {
    const navigate = useNavigate()
    const { user } = useContext(UserContext)
    const { backendErros } = useUtils()
    const { showAlert } = useContext(AlertContext)
    const { setBudget } = useContext(BudgetContext)
    const [client, setClient] = useState<Client | null>(null)
    const { showConfirm, confirmState } = useConfirm()
    const [loading, setLoading] = useState(false)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [currentStatus, setCurrentStatus] = useState(budget.status)

    const status: {
        status: string
        text: string
        color: AlertColor
        icon: JSX.Element
    }[] = [
        {
            status: 'opened',
            text: 'Em aberto',
            color: 'warning' as AlertColor,
            icon: <LockOpenRounded className='me-1' fontSize='small' />,
        },
        {
            status: 'in-progress',
            text: 'Em andamento',
            color: 'success' as AlertColor,
            icon: <LockClockRounded className='me-1' fontSize='small' />,
        },
        {
            status: 'closed',
            text: 'Fechado',
            color: 'primary' as AlertColor,
            icon: <LockRounded className='me-1' fontSize='small' />,
        },
        {
            status: 'cancelled',
            text: 'Cancelado',
            color: 'error' as AlertColor,
            icon: <NoEncryptionRounded className='me-1' fontSize='small' />,
        },
    ]

    const fetchClientData = async (id: string) => {
        try {
            const response = await axios.get(`${baseURL}/doc`, {
                params: {
                    user: user.id,
                    path: 'clients',
                    id: id.toString(),
                },
            })

            if (!response.data)
                throw {
                    message: 'Nenhum cliente encontrado',
                    code: 'NOT_FOUND',
                }

            return response.data
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

    useEffect(() => {
        const fetchClient = async () => {
            if (!isClient(budget.client)) {
                const clientData = await fetchClientData(budget.client)
                setClient(clientData)
            } else {
                setClient(budget.client)
            }
        }
        fetchClient()
    }, [budget.client])

    const isClient = (client: any): client is Client => {
        return (client as Client).name !== undefined
    }

    const editBudget = () => {
        setBudget({
            ...budget,
            editing: true,
        })
        navigate('/dashboard/budgets/new')
    }

    const deleteBudget = async (id: string) => {
        try {
            await showConfirm({
                title: 'Excluir Orçamento',
                message: 'Tem certeza que deseja excluir este orçamento?',
                onCancel: () => {
                    return
                },
                onConfirm: async () => {
                    showAlert({
                        message: `Excluindo orçamento ${id}`,
                        type: 'info',
                    })

                    await axios.delete(`${baseURL}/doc`, {
                        params: {
                            user: user.id,
                            path: 'budgets',
                            id: id.toString(),
                        },
                    })

                    showAlert({
                        message: 'O orçamento foi excluído com sucesso',
                        type: 'success',
                    })

                    update()
                },
            })
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

    const handleStatusClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const handleStatusChange = async (
        status: 'opened' | 'in-progress' | 'closed' | 'cancelled'
    ) => {
        handleMenuClose()
        if (status === 'closed') {
            await showConfirm({
                title: 'Alterar valor do orçamento',
                message: 'Deseja alterar o valor do orçamento?',
                onConfirm: () => {
                    setDialogOpen(true)
                    return
                },
            })
        }

        try {
            setLoading(true)
            await axios.put(`${baseURL}/doc?user=${user.id}`, {
                path: 'budgets',
                id: budget.id.toString(),
                data: { status },
            })
            setCurrentStatus(status)
            setLoading(false)
        } catch (error) {
            console.log(error)
            const err: any = error
            const code =
                err?.response?.data?.code || err.code || 'UNKNOWN_ERROR'
            const message =
                backendErros(code) || err.message || 'Erro inesperado'
            showAlert({ message, type: 'error' })
            setLoading(false)
        }
    }

    const handleDialogClose = (newValue?: number) => {
        setDialogOpen(false)
        if (newValue !== undefined) {
            // Update budget with new value
            // Implementar lógica para atualizar o valor do orçamento (plantValue)
        }
    }

    const currentStatusObj =
        status.find((s) => s.status === currentStatus) || status[0]

    return (
        <React.Fragment>
            <Card sx={{ height: '100%' }}>
                <CardContent
                    sx={{ height: '100%' }}
                    className='d-flex flex-column justify-content-between'
                >
                    <Box>
                        <Typography>
                            <strong>Cliente:</strong>{' '}
                            {client ? client.name : 'Cliente desconhecido'}
                        </Typography>
                        <Typography>
                            <strong>Número da Proposta:</strong> {budget.id}
                        </Typography>
                        <Typography>
                            <strong>Tamanho da Usina:</strong>{' '}
                            {budget.peakGeneration}
                        </Typography>
                        <Typography>
                            <strong>
                                {client && client.cpf ? 'CPF:' : 'CNPJ:'}
                            </strong>{' '}
                            {client ? client.cpf || client.cnpj : 'N/A'}
                        </Typography>
                        <Typography>
                            <strong>Telefone:</strong>{' '}
                            {client ? client.phone : 'N/A'}
                        </Typography>
                    </Box>
                    <Grid container spacing={2} className='mt-2'>
                        <Grid item xs={12}>
                            <Alert
                                severity={currentStatusObj.color}
                                icon={currentStatusObj.icon}
                            >
                                {currentStatusObj.text}
                            </Alert>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                color='primary'
                                startIcon={<VisibilityRounded />}
                                variant='contained'
                                fullWidth
                                onClick={() => navigate(budget.id.toString())}
                                disabled={loading}
                            >
                                Ver
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                color='primary'
                                startIcon={<EditRounded />}
                                variant='contained'
                                fullWidth
                                onClick={editBudget}
                                disabled={
                                    loading ||
                                    currentStatus === 'closed' ||
                                    currentStatus === 'cancelled'
                                }
                            >
                                Editar
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                color='error'
                                startIcon={<DeleteRounded />}
                                variant='contained'
                                fullWidth
                                onClick={() =>
                                    deleteBudget(budget.id.toString())
                                }
                                disabled={loading}
                            >
                                Excluir
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                color='primary'
                                startIcon={<LoopRounded />}
                                variant='contained'
                                fullWidth
                                onClick={handleStatusClick}
                                disabled={
                                    loading ||
                                    currentStatus === 'closed' ||
                                    currentStatus === 'cancelled'
                                }
                            >
                                Status
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                {status.map((s) => (
                                    <MenuItem
                                        key={s.status}
                                        onClick={() =>
                                            handleStatusChange(
                                                s.status as
                                                    | 'opened'
                                                    | 'in-progress'
                                                    | 'closed'
                                                    | 'cancelled'
                                            )
                                        }
                                    >
                                        {s.icon}
                                        {s.text}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Confirm
                open={!!confirmState.title}
                onClose={() =>
                    showConfirm({ ...confirmState, title: '', message: '' })
                }
                title={confirmState.title}
                message={confirmState.message}
                onConfirm={confirmState.onConfirm ?? (() => {})}
                onCancel={confirmState.onCancel}
            />
            <EditPlantValue open={dialogOpen} onClose={handleDialogClose} />
        </React.Fragment>
    )
}
